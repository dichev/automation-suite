#!/usr/bin/env node
'use strict';

const Program = require('dopamine-toolbox').Program
const Shell = require('dopamine-toolbox').Shell
const SSHClient = require('dopamine-toolbox').SSHClient
const cfg = require('configurator')

const ONLY_GCLOUD_MYSQL_HOSTS = Object.values(cfg.hosts).filter(h => h.type === 'mysql-master' && cfg.locations[h.location].gcloud).map(h => h.name)

let program = new Program({chat: cfg.chat.rooms.devops})
program
    .description('Resize master mysql VM on Google Cloud with minimal downtime')
    .option('-h, --hosts <list|all>', 'The target host names', { choices: ONLY_GCLOUD_MYSQL_HOSTS, required: true })
    

program.iterate('hosts', async (name) => {
    let shell = new Shell()
    let host = cfg.hosts[name]
    
    const DB_GROUP = Object.entries(cfg.databases).find(([group, dbs]) => dbs.master === host.ip)[0]
    if(!DB_GROUP && !cfg.databases[DB_GROUP]) throw Error(`Can't find database group`)
    console.log(`Working on ${host.name} in ${DB_GROUP} group`)
    
    // check resources
    console.log(`Switch to project: ${cfg.locations[host.location].gcloud.project}`)
    await shell.exec(`gcloud config set project ${cfg.locations[host.location].gcloud.project}`)
    const INSTANCE = await shell.exec(`gcloud compute instances list | grep ${host.ip} | awk '{print $1}'`)
    const ZONE = await shell.exec(`gcloud compute instances list | grep ${host.ip} | awk '{print $2}'`) // TODO: optimize a bit
    if(!INSTANCE) throw Error(`There is no gcloud compute instance with this ip ${host.ip}`)
    await shell.exec(`gcloud compute instances list | grep ${host.ip}`)
    await program.confirm(`Are you sure you want to change instance "${INSTANCE}" to custom (${host.resources.cpu} vCPU, ${host.resources.memory} GiB)?`)


    // stop crontab on web1
    await program.chat.message(`Stopping cron jobs..`)
    let web1 = await new SSHClient().connect({host: cfg.locations[host.location].hosts.web1, username: 'root'})
    await web1.exec('systemctl stop cron')
    await web1.disconnect()
    await program.sleep(60, 'Waiting cronjobs to finish just in case')


    // disable webs traffic
    await program.chat.message(`Disable traffic`)
    await shell.exec(`node servers/nginx/disable-operators -l ${host.location} -o all --filter-by-databases ${DB_GROUP} --no-chat`)

    
    // stop mysql
    await program.chat.message(`Stopping mysql..`)
    let ssh = await new SSHClient().connect({host: host.ip, username: 'root'})
    while (true) {
        await program.sleep(1, 'waiting')
        let list = await ssh.exec(`mysql -rsN -e "SELECT host, user, state FROM information_schema.PROCESSLIST WHERE user LIKE ('%platform')"`)
        let connections = list.trim() ? list.trim().split('\n').length : 0
        console.log(`Found ${connections} active connections`)
        if(connections === 0) break
    }
    
    ssh.exec(`tail -f /var/log/mysql/error.log`).catch(() => {})
    await ssh.exec(`/etc/init.d/mysql stop && sleep 3`)
    await program.confirm('Wait mysql to fully stop, then press <ENTER> to continue..')
    await ssh.exec('killall tail') // TODO: workaround, must look for better syntax
    await ssh.disconnect()

    
    // gcloud compute instances stop NAME
    await program.confirm('Stop the VM?')
    await program.chat.message(`Stopping VM..`)
    await shell.exec(`gcloud compute instances stop ${INSTANCE} --zone ${ZONE}`)
    
    
    // gcloud compute instances set-machine-type NAME --machine-type custom-4-1024 4=4vCPU, 1024=1G RAM
    await program.chat.message(`Changing VM resources..`)
    await shell.exec(`gcloud compute instances set-machine-type ${INSTANCE} \
        --zone=${ZONE} \
        --custom-cpu=${host.resources.cpu} \
        --custom-memory=${host.resources.memory}
    `)
    
    
    // gcloud compute instances start NAME
    await program.chat.message(`Starting VM..`)
    await shell.exec(`gcloud compute instances start ${INSTANCE} --zone ${ZONE}`)
    await program.sleep(20, 'Waiting a bit more')
    await shell.exec(`gcloud compute instances list --filter "${INSTANCE}"`)
    await program.confirm('Is it fine?')
    
    
    // test is it mysql working
    await program.chat.message(`Checking is mysql working..`)
    ssh = await new SSHClient().connect({host: host.ip, username: 'root'})
    ssh.exec(`tail -f /var/log/mysql/error.log`).catch(() => {})
    
    while (true) {
        let status = await ssh.exec(`systemctl is-active mysql || echo `)
        if(status.trim() === 'inactive') {
            break
        }
        await program.sleep(1, 'waiting')
    }
    await program.confirm('If mysql is stopped, then press <ENTER> to continue')
    await ssh.exec('killall tail') // TODO: workaround, must look for better syntax
    await ssh.disconnect()
    
    
    // enable operators
    await program.chat.message(`Activate traffic`)
    await shell.exec(`node servers/nginx/disable-operators -l ${host.location} -o all --filter-by-databases ${DB_GROUP} --no-chat --enable`)
    
    // start crontab on web1
    await program.chat.message(`Starting cron jobs..`)
    web1 = await new SSHClient().connect({host: cfg.locations[host.location].hosts.web1, username: 'root'})
    await web1.exec('systemctl start cron')
    await web1.disconnect()
    
})
