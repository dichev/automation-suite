#!/usr/bin/env node
'use strict';

const Program = require('dopamine-toolbox').Program
const Shell = require('dopamine-toolbox').Shell
const SSHClient = require('dopamine-toolbox').SSHClient
const cfg = require('configurator')

const ONLY_GCLOUD_WEB_HOSTS = Object.values(cfg.hosts).filter(h => h.type === 'web' && cfg.locations[h.location].gcloud).map(h => h.name)

let program = new Program()
program
    .description('Resize webs VM on Google Cloud without downtime')
    .option('-h, --hosts <list|all>', 'The target host names', { choices: ONLY_GCLOUD_WEB_HOSTS, required: true })
    

program.iterate('hosts', async (name) => {
    let shell = new Shell()
    let host = cfg.hosts[name]
    const WEB = cfg.locations[host.location].hosts.webs.find(w => w.name === name)
    
    // 0. switch webs traffic
    await program.chat.message(`Disable traffic to ${WEB}`)
    await shell.exec(`node servers/nginx/switch-webs-by-location -l ${host.location} -w all --exclude-webs ${WEB} --no-chat`)
    
    
    // 1. stop crontab on web1
    if(WEB === 'web1'){
        await program.chat.message(`Stopping cron jobs..`)
        let ssh = await new SSHClient().connect({host: host.ip, username: 'root'})
        await ssh.exec('systemctl stop crontab') // it will be auto started after the vm restart
        await ssh.disconnect()
        await program.sleep(60, 'Waiting cronjobs to finish just in case')
    }
    
    // 2. gcloud compute instances stop NAME
    await program.confirm('Stop the VM?')
    await program.chat.message(`Stopping VM..`)
    await shell.exec(`gcloud config set project ${cfg.locations[host.name].gcloud.project}`)
    await shell.exec(`gcloud compute instances stop ${host.name}`) // TODO: possible name conflicts with google cloud instance name
    
    
    // 3. gcloud compute instances set-machine-type NAME --machine-type custom-4-1024 4=4vCPU, 1024=1G RAM
    await program.chat.message(`Changing VM resources..`)
    await shell.exec(`gcloud compute set-machine-type ${host.name} \
        --custom-cpu=${host.resources.cpu} \
        --custom-memory=${host.resources.memory}
    `)
    
    
    // 4. gcloud compute instances start NAME
    await program.chat.message(`Starting VM..`)
    await shell.exec(`gcloud compute instances start ${host.name}`)
    await shell.exec(`gcloud compute instances list --filter "${host.name}"`)
    await program.confirm('Is it fine?')
    
    
    // 5. test is it php working
    await program.chat.message(`Checking is php working..`)
    await shell.exec(`node servers/php-binary/check -h ${host.name} --no-chat`)
    
    // 6. enable operators
    await program.chat.message(`Activate traffic to ${WEB}`)
    await shell.exec(`node servers/nginx/switch-webs-by-location -l ${host.location} -w all --no-chat`)
    
    
    
})
