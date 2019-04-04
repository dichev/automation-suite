#!/usr/bin/env node
'use strict';

const Program = require('dopamine-toolbox').Program
const cfg = require('configurator')
let program = new Program({ chat: cfg.chat.rooms.devops })
const ipConfig = require('./ipConfig')

const PORT = 9104;
const MYSQL_PORT = 3306;
const devQAMySQLIP = '192.168.14.31';
const maltaMySQLIP = '192.168.226.202';

program
.description('Setup monitoring: Mysqld Exporter')
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

    if (! await ssh.packageExists('nettools')) {
        await ssh.exec('apt-get install -y net-tools > /dev/null')
    }

    // Skip host if mysql is not installed
    let mysqlPortInUse = await ssh.exec(`netstat -tulpn | grep LISTEN | grep ${MYSQL_PORT} > /dev/null 2>&1 && echo '1' || echo '0'`)
    if (mysqlPortInUse === '0') return;

    let portIsInUse = await ssh.exec(`netstat -tulpn | grep LISTEN | grep ${PORT} > /dev/null 2>&1 && echo '1' || echo '0'`)
    let iptablesRulesExist = await ssh.exec(`iptables -L | awk -F ':' ' {print $2}' | sort -u | grep ${PORT} > /dev/null 2>&1 && echo '1' || echo '0'`)

    if (!force && (portIsInUse === '1' && iptablesRulesExist === '1')) {
        await program.chat.notify('Skipping host')
    }
    else {
        await ssh.exec('rm -frv /opt/mysqld_exporter') //temp

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
            await program.chat.notify('Cloning exporters repo...')
            await shell.exec('git clone git@gitlab.dopamine.bg:devops/monitoring/exporters.git')
            await shell.exec(`rsync -vrltgoD --delete exporters root@${hostIP}:/opt/dopamine`)
            await shell.exec('rm -rf exporters') // delete locally
        }

        await ssh.exec('chmod +x /opt/dopamine/exporters/mysqld_exporter/mysqld_exporter') // delete on server

        // Delete old service file
        await ssh.exec(`rm -f /etc/systemd/system/multi-user.target.wants/prometheus-mysqld-exporter.service`)
        await ssh.exec(`rm -f /etc/systemd/system/prometheus-mysqld-exporter.service`)

        // Service start
        await program.chat.notify('Create & starting service...')
        // Set custom service file for devQA MySQL, because there're too many databases, that lead to memory leak
        if (hostIP === devQAMySQLIP) {
            await ssh.exec('systemctl enable /opt/dopamine/exporters/mysqld_exporter/mysqld_exporter-dev.service')
        }
        // Set custom service file for malta MySQL, because there're too many metrics collected that we don't need
        else if (hostIP === maltaMySQLIP) {
            await ssh.exec('systemctl enable /opt/dopamine/exporters/mysqld_exporter/mysqld_exporter-malta.service')
        }
        else {
            await ssh.exec('systemctl enable /opt/dopamine/exporters/mysqld_exporter/mysqld_exporter.service')
        }
        await ssh.exec('systemctl restart mysqld_exporter.service')
        await program.sleep(1, 'Getting status too early lead to errors');
        await ssh.exec('systemctl status mysqld_exporter.service')

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
        await ssh.exec(`netstat -plant | grep mysqld_export | grep -i listen || echo 'mysqld_exporter not running!!!'`)

        // Check version
        await ssh.exec(`/opt/dopamine/exporters/mysqld_exporter/mysqld_exporter --version || echo 'mysqld_exporter not installed!!!'`)

        await program.chat.notify('Success')
    }
})
