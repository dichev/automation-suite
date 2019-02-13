#!/usr/bin/env node
'use strict';

const Program = require('dopamine-toolbox').Program
const Shell = require('dopamine-toolbox').Shell
const SSHClient = require('dopamine-toolbox').SSHClient
const cfg = require('configurator')
let program = new Program()


program
    .description('Resize webs VM on Google Cloud without downtime')
    .option('-h, --hosts <list|all>', 'The target host names', { choices: Object.values(cfg.hosts).filter(h => h.type === 'web'), required: true })
    

program.iterate('hosts', async (name) => { // TODO: check is the web on google cloud
    let shell = new Shell()
    let host = cfg.hosts[name]
    let webId = cfg.locations[host.location].hosts.webs.find(w => w.name === name)
    let web = await new SSHClient().connect({host: cfg.getHost(host).ip, username: 'root'})
    
    // 0. switch user and projects
    await program.chat.message(`Disable traffic to ${webId}`)
    await shell.exec(`node servers/nginx/switch-webs-by-location -l ${host.location} -w all --exclude-webs ${webId} --no-chat`)
    
    
    // 1. stop crontab on web1
    if(webId === 'web1'){
        await program.chat.message(`Stopping cron jobs..`)
        await web.exec('systemctl stop crontab') // it will be auto started after the vm restart
        await program.sleep(60, 'Waiting cronjobs to finish just in case')
    }
    
    // 2. gcloud compute instances stop NAME
    await program.chat.message(`Stopping VM..`)
    await shell.exec(`gcloud compute instances stop ${host.name}`) // TODO: possible name conflicts with google cloud instance name
    
    
    // 3. gcloud compute instances set-machine-type NAME --machine-type custom-4-1024 4=4vCPU, 1024=1G RAM
    await program.chat.message(`Changing VM resources..`)
    await shell.exec(`gcloud compute set-machine-type ${host.name}
        --custom-cpu=${host.resources.cpu} \
        --custom-memory=${host.resources.memory}
    `)
    
    
    // 4. gcloud compute instances start NAME
    await program.chat.message(`Starting VM..`)
    await shell.exec(`gcloud compute instances start ${host.name}`)
    
    
    // 5. enable operators
    await program.chat.message(`Activate traffic to ${webId}`)
    await shell.exec(`node servers/nginx/switch-webs-by-location -l ${host.location} -w all --no-chat`)
    
    
    await web.disconnect()
})
