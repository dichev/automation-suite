#!/usr/bin/env node
'use strict';

const Program = require('dopamine-toolbox').Program
const cfg = require('configurator').OfficeConfig
let program = new Program({ chat: cfg.chat.rooms.devops })

let nodejsExporterService = `[Unit]
Description=Node Exporter
After=network.target

[Service]
User=node_exporter
Group=node_exporter
Type=simple
ExecStart=/opt/node_exporter/node_exporter --collector.textfile.directory=/var/log/textfile_collector --collector.systemd
Restart=always

[Install]
WantedBy=multi-user.target
`
// nodejs exporter port
const PORT = 9100;
const IP1 = '192.168.100.64';
const IP2 = '192.168.100.65';
const IP3 = '192.168.100.14';
const IP4 = '192.168.110.64';
const IP5 = '192.168.110.65';
const IP6 = '192.168.110.14';
const IP7 = '192.168.100.66';
const IP8 = '192.168.110.66';

program
.description('Setup monitoring nodejs exporter')
.option('-h, --hosts <list|all>', 'The target host names', { choices: Object.keys(cfg.hosts), required: true })
.option('-f, --force', 'Skip manual changes validations and proceed on your risk')


.iterate('hosts', async (host) => {
    const params = program.params
    const force  = params.force !== undefined;

    let hostIP = cfg.getHost(host).ip;
    console.log(`Starting script on HOST:(${host} : ${hostIP})...`)
    await program.chat.notify(`Starting script on HOST:(${host} : ${hostIP})...`)

    let ssh = await program.ssh(cfg.getHost(host).ip, 'root')

    let checkNetToolsInstalled = await ssh.exec(`dpkg -l | grep nettools > /dev/null 2>&1 && echo '1' || echo '0'`)
    if (!checkNetToolsInstalled) {
        // Install net-tools
        await ssh.exec('apt-get install -y net-tools > /dev/null')
    }

    let portIsInUse = await ssh.exec(`netstat -tulpn | grep LISTEN | grep ${PORT} > /dev/null 2>&1 && echo '1' || echo '0'`)
    let iptablesRulesExist = await ssh.exec(`iptables -L | awk -F ':' ' {print $2}' | sort -u | grep ${PORT} > /dev/null 2>&1 && echo '1' || echo '0'`)

    if (!force && (portIsInUse === '1' && iptablesRulesExist === '1')) {
        await program.chat.notify('Skipping host')
    }
    else {
        // Install
        await ssh.exec('rm -rfv /opt/node_exporter') //temp
        let optNodeExporter = '/opt/node_exporter'
        await program.chat.notify('Cloning exporters repo...')
        if (! await ssh.exists('/opt/dopamine/exporters/.git')) {
            let shell = await program.shell()
            await shell.exec('rm -rf exporters')
            await shell.exec('git clone git@gitlab.dopamine.bg:devops/monitoring/exporters.git')
            await shell.exec(`rsync -azpv exporters root@${hostIP}:/opt/dopamine`)
            await shell.exec('rm -rf exporters')
        }
        await ssh.exec(`ln -sfv /opt/dopamine/exporters/node_exporter ${optNodeExporter}`)
        await ssh.exec(`chmod +x ${optNodeExporter}/node_exporter`)

        // Create user
        await program.chat.notify('Creating node_exporter user...')
        await ssh.exec('if ! grep -q node_exporter /etc/passwd ; then useradd -rs /bin/false node_exporter; fi')

        // Delete old service file
        let nodeExporterService = '/etc/systemd/system/multi-user.target.wants/node_exporter.service';
        if(await ssh.exists(nodeExporterService)) {
            await ssh.exec(`rm ${nodeExporterService}`)
        }

        // systemd service
        await program.chat.notify('Creating node_exporter service...')
        await ssh.exec(`echo '${nodejsExporterService}' > /etc/systemd/system/node_exporter.service`)

        // Service start
        await program.chat.notify('Starting service...')
        await ssh.exec('systemctl daemon-reload')
        await ssh.exec('systemctl enable node_exporter.service')
        await ssh.exec('systemctl restart node_exporter.service')
        await ssh.exec('systemctl status node_exporter.service')

        let isInstalled = await ssh.exec(`dpkg -s iptables-persistent > /dev/null 2>&1 && echo '1' || echo '0'`)

        // Restore previous rules, prevent duplication
        if (isInstalled === '0') {
            await ssh.exec(`echo iptables-persistent iptables-persistent/autosave_v4 boolean true | debconf-set-selections`)
            await ssh.exec(`echo iptables-persistent iptables-persistent/autosave_v6 boolean true | debconf-set-selections`)
            await ssh.exec(`apt-get -y install iptables-persistent > /dev/null`)
        }

        await ssh.exec(`iptables-save > /etc/iptables/rules.v4`)
        await ssh.exec(`cat /etc/iptables/rules.v4 | grep -v ${PORT} > /tmp/rules.v4 && mv /tmp/rules.v4 /etc/iptables/rules.v4`)
        await ssh.exec('iptables-restore /etc/iptables/rules.v4')

        // Setting security rules
        await program.chat.notify('Setting security rules..')
        await ssh.exec(`iptables -I INPUT -p tcp -s 0.0.0.0/0 --dport ${PORT} -j DROP`)
        await ssh.exec(`iptables -I INPUT -p tcp -s ${IP1} --dport ${PORT} -j ACCEPT`)
        await ssh.exec(`iptables -I INPUT -p tcp -s ${IP2} --dport ${PORT} -j ACCEPT`)
        await ssh.exec(`iptables -I INPUT -p tcp -s ${IP3} --dport ${PORT} -j ACCEPT`)
        await ssh.exec(`iptables -I INPUT -p tcp -s ${IP4} --dport ${PORT} -j ACCEPT`)
        await ssh.exec(`iptables -I INPUT -p tcp -s ${IP5} --dport ${PORT} -j ACCEPT`)
        await ssh.exec(`iptables -I INPUT -p tcp -s ${IP6} --dport ${PORT} -j ACCEPT`)
        await ssh.exec(`iptables -I INPUT -p tcp -s ${IP7} --dport ${PORT} -j ACCEPT`)
        await ssh.exec(`iptables -I INPUT -p tcp -s ${IP8} --dport ${PORT} -j ACCEPT`)
        await ssh.exec(`iptables-save > /etc/iptables/rules.v4`)

    }
    await program.sleep(2, 'Waiting a bit just in case');

    // Check exporter works
    await program.chat.notify('Checking exporter work... Please wait, it could take some time')
    await ssh.exec(`netstat -plant | grep node_exporter | grep -i listen || echo 'node_exporter not running'`)

    // Check version
    await ssh.exec(`/opt/node_exporter/node_exporter --version || echo 'node_exporter not installed!!!'`)

    await program.chat.notify('Success')
})

