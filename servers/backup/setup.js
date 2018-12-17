#!/usr/bin/env node
'use strict';

const Program = require('dopamine-toolbox').Program
const cfg = require('configurator')
let program = new Program({ chat: cfg.chat.rooms.devops })

let HOSTS = Object.keys(cfg.hosts).filter(h => h.includes('sofia-mysql') && (h.includes('archive') || h.includes('mirror')))

let wrapperConfigTemplate = `[pyxbackup]
stor_dir = /backups/{{HOST}}/stor
work_dir = /backups/{{HOST}}/work
retention_sets = 8
# Whether to compress backups
compress = 1
# What compression tool, supports gzip and qpress
compress_with = gzip
extra_ibx_options = --slave-info --galera-info
`
let cronBackupTemplate = `
##(do not run when running full)    
0 {{HOUR}} * * {{incremental}} root {{pyxBackupBinPath}} --config {{wrapperCongPath}} incr {{mysqlHost}}
##(once a week)
0 {{HOUR}} * * {{full}}        root {{pyxBackupBinPath}} --config {{wrapperCongPath}} full {{mysqlHost}}
`
let archiveStartTime = 16,
    mirrorStartTime  = 0;


function getCronDays(min, max) {
    let excluded = Math.floor(Math.random() * (max - min) + min);
    let list = [];
    for (let i = min; i <= max; i++) {
        if (i !== excluded) list.push(i);
    }
    return {
        full: excluded,
        incremental: list.join(',')
    };
}

program
.description('Setup backups')
.option('-h, --hosts <list|all>', 'The target host names', { choices: HOSTS, required: true })
.iterate('hosts', async (host) => {
    let hostIP = cfg.getHost(host).ip;
    console.log(`Starting script on HOST:(${host} : ${hostIP})...`)
    await program.chat.notify(`Starting script on HOST:(${host} : ${hostIP})...`)

    console.log(host)
    let ssh = await program.ssh(cfg.getHost(host).ip, 'root')

    let checkXtraBackupInstalled = await ssh.exec(`dpkg -l | grep xtrabackup > /dev/null 2>&1 && echo '1' || echo '0'`)
    if (!checkXtraBackupInstalled) {
        await ssh.exec(`apt-get update`);
        await ssh.exec(`apt-get install xtrabackup`);
    }

    let checkGitInstalled = await ssh.exec(`dpkg -l | grep git > /dev/null 2>&1 && echo '1' || echo '0'`)
    if (!checkGitInstalled) {
        throw 'No git installed!'
    }

    let pyxBackupPath = '/opt/pyxbackup'
    let pyxBackupBinPath = pyxBackupPath + '/pyxbackup'

    // check /opt/pyxbackup exist and is not git repo AND then delete it
    if (await ssh.exists(`${pyxBackupPath}`) && ! await ssh.exists(`${pyxBackupPath}/.git`)) {
        await ssh.exec(`rm -rf ${pyxBackupPath}`)
    }

    if (! await ssh.exists(`${pyxBackupPath}/.git`)) {
        await program.chat.notify('Creating backup folders')
        await ssh.exec(`mkdir -p /backups/${host}/stor`)
        await ssh.exec(`mkdir -p /backups/${host}/work`)

        await program.chat.notify('Install python-mysqldb')
        await ssh.exec(`apt-get install python-mysqldb`)

        await program.chat.notify('Cloning pyxbackup repo...')
        await ssh.exec(`git clone git@gitlab.dopamine.bg:devops/backups/xtrabackup.git ${pyxBackupPath}`)
        await ssh.exec(`chmod 0755 ${pyxBackupBinPath}`)
    }

    // Wrapper config
    let wrapperConfig = wrapperConfigTemplate
    wrapperConfig = wrapperConfig.replace(/{{HOST}}/g, host)
    let wrapperCongPath = '/etc/pyxbackup.cnf'
    await program.chat.notify('Creating pyxbackup.cnf')
    await ssh.exec(`echo '${wrapperConfig}' > ${wrapperCongPath}`)


    // Create cron file
    await program.chat.notify('Creating cron.d file')
    let cronDays = getCronDays(0, 6)
    let cronBackup = cronBackupTemplate,
        full = cronDays.full,
        incremental = cronDays.incremental;

    cronBackup = cronBackup.replace(/{{wrapperCongPath}}/g, wrapperCongPath)
    cronBackup = cronBackup.replace(/{{pyxBackupBinPath}}/g, pyxBackupBinPath)
    cronBackup = cronBackup.replace(/{{full}}/g, full)
    cronBackup = cronBackup.replace(/{{incremental}}/g, incremental)
    if (host.includes('archive')) {
        cronBackup = cronBackup.replace(/{{HOUR}}/g, archiveStartTime)
    } else {
        cronBackup = cronBackup.replace(/{{HOUR}}/g, mirrorStartTime)
    }

    // get the correct host from .my.cnf, because there are 2 versions: 127.0.0.1 && localhost
    let mysqlHost = await ssh.exec(`cat /root/.my.cnf | grep host | cut -d'=' -f 2`)
    let mysqlHostParam = '';
    if (mysqlHost !== '') {
        mysqlHostParam = ` -H ${mysqlHost}`;
    }
    cronBackup = cronBackup.replace(/{{mysqlHost}}/g, mysqlHostParam)
    await ssh.exec(`echo '${cronBackup}' > /etc/cron.d/pyxbackup`)

    // Print custom cnf info
    await ssh.exec(`echo /opt/servers-conf-mysql/custom/${host}.cnf`)

    // Check wrapper version
    await program.chat.notify(`Checking pyxBackup version`)
    await ssh.exec(`${pyxBackupBinPath} --v`)

    // Remove old cron file
    await program.chat.notify(`Remove old cron file`)
    await ssh.exec(`rm -f /etc/cron.d/mysqldump-secure`)

    // Clone backups-collector
    if (! await ssh.exists(`/opt/backups-collector/.git`)) {
        await ssh.exec(`git clone git@gitlab.dopamine.bg:devops/backups/backups-collector.git /opt/backups-collector/`)
    }
    // Update project - backups-collector
    await ssh.chdir('/opt/backups-collector/')
    await ssh.exec('git pull')
    await ssh.exec('npm install')
    await ssh.exec('cp node_modules/configurator/secret/.credentials.example.json /opt/backups-collector/.credentials.json')

    await ssh.exec(`ln -sf /opt/backups-collector/backups-collector.service /etc/systemd/system/backups-collector.service`)

    await program.chat.notify('Starting service...')
    await ssh.exec('systemctl daemon-reload')
    await ssh.exec('systemctl enable backups-collector.service')
    await ssh.exec('systemctl restart backups-collector.service')
    await program.sleep(2, 'Waiting a bit just in case');
    await ssh.exec('systemctl status backups-collector.service')
})