#!/usr/bin/env node
'use strict';

const Program = require('dopamine-toolbox').Program
const cfg = require('configurator')
let program = new Program({ chat: cfg.chat.rooms.devops })

let HOSTS = Object.keys(cfg.hosts).filter(h => h.includes('sofia-mysql') && (h.includes('archive') || h.includes('mirror')))

program
.description('Setup backups')
.option('-h, --hosts <list|all>', 'The target host names', { choices: HOSTS, required: true })
.iterate('hosts', async (host) => {
    let hostIP = cfg.getHost(host).ip;
    console.log(`Starting script on HOST:(${host} : ${hostIP})...`)
    await program.chat.notify(`Starting script on HOST:(${host} : ${hostIP})...`)

    let ssh = await program.ssh(hostIP, 'root')

    if (! await ssh.packageExists('xtrabackup')) {
        await ssh.exec(`apt-get update`);
        await ssh.exec(`apt-get install xtrabackup`);
    }
    if (! await ssh.packageExists('git')) {
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

        if(! await ssh.packageExists('python-mysqldb')) {
            await program.chat.notify('Installing python-mysqldb...')
            await ssh.exec(`apt-get install python-mysqldb`)
        }

        await program.chat.notify('Cloning pyxbackup repo...')
        await ssh.exec(`git clone https://github.com/dotmanila/pyxbackup.git ${pyxBackupPath}`)
        await ssh.chdir(pyxBackupBinPath)
        //reset to the last stable commit. (No tags available in repo)
        await ssh.exec('git reset --hard 3e3f7af81a312209e19390eee9b947e61e6f9ec9')
        await ssh.exec(`chmod 0755 ${pyxBackupBinPath}`)
    }

    // Wrapper config
    let wrapperCongPath = '/etc/pyxbackup.cnf'

    await program.chat.notify('Creating pyxbackup.cnf')
    await ssh.exec(`cat /opt/servers-conf-mysql/pyxbackup/conf/${host}.cnf > ${wrapperCongPath}`)

    // Create cron file
    await program.chat.notify('Creating cron.d file')
    await ssh.exec(`ln -sfv /opt/servers-conf-mysql/pyxbackup/cron/${host}.cnf /etc/cron.d/${host}`)

    // Check wrapper version
    await program.chat.notify(`Checking pyxBackup version`)
    await ssh.exec(`${pyxBackupBinPath} --v`)

    // Remove old cron file
    // await program.chat.notify(`Remove old cron file`)
    // await ssh.exec(`rm -vf /etc/cron.d/mysqldump-secure`)

    // Clone backups-collector
    if (! await ssh.exists(`/opt/backups-collector/.git`)) {
        await ssh.exec(`git clone git@gitlab.dopamine.bg:devops/backups/backups-collector.git /opt/backups-collector/`)
    }
    // Update project - backups-collector
    await ssh.chdir('/opt/backups-collector/')
    await ssh.exec('git pull')
    await ssh.exec(`cat '{"hostname": "${host}"}' > /opt/backups-collector/.hostConf.json`)
    await ssh.exec('rm -rf /opt/backups-collector/node_modules') // TEMP!!!!!
    await ssh.exec('npm install')
    await program.sleep(1, 'Waiting a bit just in case');

    await ssh.exec('mkdir -p /var/log/textfile_collector')

    await program.chat.notify('Starting service...')
    await ssh.exec('systemctl enable /opt/backups-collector/backups-collector.service')
    await ssh.exec('systemctl restart backups-collector.service')

    await program.chat.notify('Success')
})