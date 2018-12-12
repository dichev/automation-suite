#!/usr/bin/env node
'use strict';

const Program = require('dopamine-toolbox').Program
const cfg = require('configurator')
let program = new Program({ chat: cfg.chat.rooms.devops })

let HOSTS = Object.keys(cfg.hosts).filter(h => h.includes('sofia-mysql') && (h.includes('archive') || h.includes('mirror')))
// console.log(HOSTS)

let wrapperConfigTemplate = `
    [pyxbackup]
    stor_dir = /backups/{{HOST}}/stor
    work_dir = /backups/{{HOST}}/work
    retention_sets = 8
    # Whether to compress backups
    compress = 1
    # What compression tool, supports gzip and qpress
    compress_with = gzip
`
let cronBackupTemplate = `
##(do not run when running full)    
0 {{HOUR}} * * {{incremental}} root {{pyxBackupPath}} --config {{wrapperCongPath}} incr
##(once a week)
0 {{HOUR}} * * {{full}}        root {{pyxBackupPath}} --config {{wrapperCongPath}} full
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

function getRandomIntInclusive(min, max, exclude) {
    min = Math.ceil(min);
    max = Math.floor(max);
    exclude = Math.floor(exclude)
    let result;
    while(1) {
        result = Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
        if (result !== exclude) break;
    }

    return result;
}

program
.description('Setup backups')
.option('-h, --hosts <list|all>', 'The target host names', { choices: HOSTS, required: true })
.option('-f, --force', 'Skip manual changes validations and proceed on your risk')
.iterate('hosts', async (host) => {
    const params = program.params
    const force  = params.force !== undefined;

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
    if (! await ssh.exists(`${pyxBackupPath}/.git`)) {
        await program.chat.notify('Creating backup folders')
        await ssh.exec(`mkdir -p /backups/${host}/stor`)
        await ssh.exec(`mkdir -p /backups/${host}/work`)

        await program.chat.notify('Install python-mysqldb')
        await ssh.exec(`apt-get install python-mysqldb`)

        await program.chat.notify('Cloning pyxbackup repo...')
        await ssh.exec(`git clone git@gitlab.dopamine.bg:devops/backups/xtrabackup.git ${pyxBackupPath}`)
        await ssh.exec(`chmod 0755 ${pyxBackupPath}`)
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
    cronBackup = cronBackup.replace(/{{pyxBackupPath}}/g, pyxBackupPath)
    cronBackup = cronBackup.replace(/{{full}}/g, full)
    cronBackup = cronBackup.replace(/{{incremental}}/g, incremental)
    if (host.includes('archive')) {
        cronBackup = cronBackup.replace(/{{HOUR}}/g, archiveStartTime)
    } else {
        cronBackup = cronBackup.replace(/{{HOUR}}/g, mirrorStartTime)
    }
    await ssh.exec(`echo '${cronBackup}' > /etc/cron.d/pyxbackup`)


    // Check wrapper version
    await program.chat.notify(`Checking pyxBackup version`)
    await ssh.exec(`${pyxBackupPath} --v`)

    // Remove old cron file
    await program.chat.notify(`Remove old cron file`)
    await ssh.exec(`rm -f /etc/cron.d/mysqldump-secure`)
})