#!/usr/bin/env node
'use strict';

const Program = require('dopamine-toolbox').Program
const cfg = require('configurator')
let program = new Program({ chat: cfg.chat.rooms.devops })
const ipConfig = require('./ipConfig')

// node_exporter port
const PORT = 9100;

program
.description('Setup monitoring: Node Exporter')
.option('-h, --hosts <list|all>', 'The target host names', { choices: Object.keys(cfg.hosts), required: true })
.option('-n, --networks <list|all>', 'Networks', { choices: [... new Set(Object.values(cfg.hosts).map(i => i.network))], required: true})
.option('-f, --force', 'Skip manual changes validations and proceed on your risk')
.parse()

// filter by network
let filteredHosts = program.params.hosts.split(',')
program.params.hosts = Object.values(cfg.hosts).filter(h => program.params.networks.includes(h.network) && filteredHosts.includes(h.name)).map(i => i.name).join(',')

program.iterate('hosts', async (host) => {
    const params = program.params
    const force  = params.force !== undefined;
    let networks  = params.networks !== undefined ? params.networks : null;
    networks = networks.split(',')

    let hostNetwork = cfg.getHost(host).network;

    // Execute only if the host network is included
    if (!networks.includes(hostNetwork)) return;

    if (!ipConfig[hostNetwork]) throw Error(`${hostNetwork} does not exist in ipConfig!`)

    let hostIP = cfg.getHost(host).ip;

    console.log(`Starting script on HOST:(${host} : ${hostIP})...`)
    await program.chat.notify(`Starting script on HOST:(${host} : ${hostIP})...`)

    let ssh = await program.ssh(cfg.getHost(host).ip, 'root')

    // install git
    if (await ssh.exec(`git --version > /dev/null 2>&1 && echo '1' || echo '0'`) === '0') {
        await ssh.exec('apt-get update -y && apt-get install git -y > /dev/null')
    }

    // install nettools
    if (! await ssh.packageExists('nettools')) {
        await ssh.exec('apt-get install -y net-tools > /dev/null')
    }

    let portIsInUse = await ssh.exec(`netstat -tulpn | grep LISTEN | grep ${PORT} > /dev/null 2>&1 && echo '1' || echo '0'`)
    let iptablesRulesExist = await ssh.exec(`iptables -L | awk -F ':' ' {print $2}' | sort -u | grep ${PORT} > /dev/null 2>&1 && echo '1' || echo '0'`)

    if (!force && (portIsInUse === '1' && iptablesRulesExist === '1')) {
        await program.chat.notify('Skipping host')
    }
    else {
        // Remove previous symlink
        await ssh.exec('rm -frv /opt/node_exporter') // temp

        if(await ssh.packageExists('git')) {
            if(!await ssh.exists('/opt/dopamine/exporters/')) {
                await ssh.exec('git clone git@gitlab.dopamine.bg:devops/monitoring/exporters.git /opt/dopamine/exporters')
            }
            await ssh.chdir('/opt/dopamine/exporters')
            await ssh.exec('git reset --hard && git pull')
        } else {
            // Install (Some servers does not have git, so we rsync it instead)
            // Starting local shell
            let shell = await program.shell()
            await shell.exec('rm -rf exporters') // delete locally
            await program.chat.notify('Cloning exporters repo(Locally)')
            await shell.exec('git clone git@gitlab.dopamine.bg:devops/monitoring/exporters.git')
            await shell.exec(`rsync -vrltgoD --delete exporters root@${hostIP}:/opt/dopamine`)
            await shell.exec('rm -rf exporters') // delete locally
        }

        await ssh.exec('chmod +x /opt/dopamine/exporters/node_exporter/node_exporter') // delete on server

        // Add folder where logs will be placed
        await ssh.exec('mkdir -p /var/log/textfile_collector')

        // Create user
        await program.chat.notify('Creating node_exporter user...')
        await ssh.exec('if ! grep -q node_exporter /etc/passwd ; then useradd -rs /bin/false node_exporter; fi')

        // Delete old service file
        await ssh.exec(`rm -f /etc/systemd/system/multi-user.target.wants/node_exporter.service`)
        await ssh.exec(`rm -f /etc/systemd/system/node_exporter.service`)

        let optNodeExporterPath = '/opt/dopamine/exporters/node_exporter'

        // Service start
        await program.chat.notify('Creating & starting service...')
        await ssh.exec(`systemctl enable ${optNodeExporterPath}/node_exporter.service`)
        await ssh.exec('systemctl restart node_exporter.service')
        await program.sleep(1, 'Getting status too early lead to errors');
        await ssh.exec('systemctl status node_exporter.service')

        // Restore previous rules, prevent duplication
        if (! await ssh.packageExists('iptables-persistent')) {
            await ssh.exec(`echo iptables-persistent iptables-persistent/autosave_v4 boolean true | debconf-set-selections`)
            await ssh.exec(`echo iptables-persistent iptables-persistent/autosave_v6 boolean true | debconf-set-selections`)
            await ssh.exec(`apt-get -y install iptables-persistent > /dev/null`)
        }

        // Remove previously added ips from us, then restore them
        await ssh.exec(`iptables-save > /etc/iptables/rules.v4`)
        await ssh.exec(`cat /etc/iptables/rules.v4 | grep -v ${PORT} > /tmp/rules.v4 && mv /tmp/rules.v4 /etc/iptables/rules.v4`)
        await ssh.exec('iptables-restore /etc/iptables/rules.v4')

        // Setting security rules
        await program.chat.notify('Setting security rules..')
        await ssh.exec(`iptables -I INPUT -p tcp -s 0.0.0.0/0 --dport ${PORT} -j DROP`)
        for(let y=0; y < ipConfig[hostNetwork].length; y++) {
            await ssh.exec(`iptables -I INPUT -p tcp -s ${ipConfig[hostNetwork][y]} --dport ${PORT} -j ACCEPT`)
        }
        await ssh.exec(`iptables-save > /etc/iptables/rules.v4`)


        // Sleep
        await program.sleep(2, 'Waiting a bit just in case');

        // Check exporter works
        await program.chat.notify('Checking exporter work... Please wait, it could take some time')
        await ssh.exec(`netstat -plant | grep node_exporter | grep -i listen || echo 'node_exporter not running'`)

        // Check version
        await ssh.exec(`${optNodeExporterPath}/node_exporter --version || echo 'node_exporter not installed!!!'`)

        await program.chat.notify('Success')
    }
})

