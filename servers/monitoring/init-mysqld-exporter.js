#!/usr/bin/env node
'use strict';

const Program = require('dopamine-toolbox').Program
const cfg = require('configurator').OfficeConfig
let program = new Program({ chat: cfg.chat.rooms.devops })

let mysqlExporterServiceTemplate = `[Unit]
Description=Prometheus MySQL Exporter
After=network.target

[Service]
User=root
Group=root
Type=simple
{{ExecStart}}
Restart=always

[Install]
WantedBy=multi-user.target
`

let devQACustomExecStart = `ExecStart=/opt/mysqld_exporter/mysqld_exporter --collect.binlog_size --no-collect.info_schema.tables --no-collect.info_schema.processlist`
let defaultExecStart     = `ExecStart=/opt/mysqld_exporter/mysqld_exporter --collect.info_schema.innodb_metrics --collect.info_schema.userstats --collect.perf_schema.eventsstatements --collect.perf_schema.indexiowaits --collect.perf_schema.tableiowaits --collect.heartbeat --collect.heartbeat.database=test --collect.heartbeat.table=heartbeat`
const PORT = 9104;
const MYSQL_PORT = 3306;
const IP1 = '192.168.100.64';
const IP2 = '192.168.100.65';
const IP3 = '192.168.100.14';
const IP4 = '192.168.110.64';
const IP5 = '192.168.110.65';
const IP6 = '192.168.110.14';
const IP7 = '192.168.100.66';
const IP8 = '192.168.110.66';
const devQAMySQLIP = '192.168.14.31';

program
.description('Setup monitoring mysql exporter')
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

    // Skip host if mysql is not installed
    let mysqlPortInUse = await ssh.exec(`netstat -tulpn | grep LISTEN | grep ${MYSQL_PORT} > /dev/null 2>&1 && echo '1' || echo '0'`)
    if (mysqlPortInUse === '0') return;

    let portIsInUse        = await ssh.exec(`netstat -tulpn | grep LISTEN | grep ${PORT} > /dev/null 2>&1 && echo '1' || echo '0'`)
    let iptablesRulesExist = await ssh.exec(`iptables -L | awk -F ':' ' {print $2}' | sort -u | grep ${PORT} > /dev/null 2>&1 && echo '1' || echo '0'`)

    if (!force && (portIsInUse === '1' && iptablesRulesExist === '1')) {
        await program.chat.notify('Skipping host')
    }
    else {
        // Install
        await ssh.exec('rm -rfv /opt/mysqld_exporter') //temp
        let optMysqlNodeExporter = '/opt/mysqld_exporter'
        await program.chat.notify('Cloning exporters repo...')
        if (! await ssh.exists('/opt/dopamine/exporters/.git')) {
            let shell = await program.shell()
            await shell.exec('rm -rf exporters')
            await shell.exec('git clone git@gitlab.dopamine.bg:devops/monitoring/exporters.git')
            await shell.exec(`rsync -azpv exporters root@${hostIP}:/opt/dopamine`)
            await shell.exec('rm -rf exporters')
        }
        await ssh.exec(`ln -sfv /opt/dopamine/exporters/mysqld_exporter ${optMysqlNodeExporter}`)
        await ssh.exec(`chmod +x ${optMysqlNodeExporter}/mysqld_exporter`)

        // Delete old service file
        let oldOptMysqlExporter = '/etc/systemd/system/multi-user.target.wants/prometheus-mysqld-exporter.service';
        if(await ssh.exists(oldOptMysqlExporter)) {
            await ssh.exec('systemctl stop prometheus-mysqld-exporter.service')
            await ssh.exec(`rm ${oldOptMysqlExporter}`)
        }

        // systemd service
        await program.chat.notify('Creating mysql_exporter service...')

        // set custom service file for devQA MySQL, because there're too many databases, that lead to memory leak
        let mysqlExporterService = mysqlExporterServiceTemplate;
        if (hostIP === devQAMySQLIP) {
            mysqlExporterService = mysqlExporterService.replace(/{{ExecStart}}/, devQACustomExecStart)
        } else {
            mysqlExporterService = mysqlExporterService.replace(/{{ExecStart}}/, defaultExecStart)
        }
        await ssh.exec(`echo '${mysqlExporterService}' > /etc/systemd/system/mysqld_exporter.service`)

        // Service start
        await program.chat.notify('Starting service...')
        await ssh.exec('systemctl daemon-reload')
        await ssh.exec('systemctl enable mysqld_exporter.service')
        await ssh.exec('systemctl restart mysqld_exporter.service')
        await ssh.exec('systemctl status mysqld_exporter.service')

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
    await ssh.exec(`netstat -plant | grep mysqld_export | grep -i listen || echo 'mysqld_exporter not running!!!'`)

    // Check version
    await ssh.exec(`/opt/mysqld_exporter/mysqld_exporter --version || echo 'mysqld_exporter not installed!!!'`)

    await program.chat.notify('Success')
})

