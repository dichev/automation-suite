#!/usr/bin/env node
'use strict';

const Program = require('dopamine-toolbox').Program
const Shell = require('dopamine-toolbox').Shell
const SSHClient = require('dopamine-toolbox').SSHClient
const cfg = require('configurator')

const ONLY_GCLOUD_WEB_HOSTS = Object.values(cfg.hosts).filter(h => h.type === 'web' && cfg.locations[h.location].gcloud).map(h => h.name)

let program = new Program({chat: cfg.chat.rooms.devops})
program
    .description('Resize webs VM on Google Cloud without downtime')
    .option('-h, --hosts <list|all>', 'The target host names', { choices: ONLY_GCLOUD_WEB_HOSTS, required: true })
    

program.iterate('hosts', async (name) => {
    let shell = new Shell()
    let host = cfg.hosts[name]
    const WEB = cfg.locations[host.location].hosts.webs.find(w => w.name === name)
    
    // check resources
    console.log(`Switch to project: ${cfg.locations[host.location].gcloud.project}`)
    await shell.exec(`gcloud config set project ${cfg.locations[host.location].gcloud.project}`)
    const INSTANCE = await shell.exec(`gcloud compute instances list | grep ${host.ip} | awk '{print $1}'`)
    if(!INSTANCE) throw Error(`There is no gcloud compute instance with this ip ${host.ip}`)
    await shell.exec(`gcloud compute instances list | grep ${host.ip}`)
    await program.confirm(`Are you sure you want to change instance "${INSTANCE}" to custom (${host.resources.cpu} vCPU, ${host.resources.memory} GiB)?`)
    
    // switch webs traffic
    await program.chat.message(`Disable traffic to ${WEB}`)
    await shell.exec(`node servers/nginx/switch-webs-by-location -l ${host.location} -w all --exclude-webs ${WEB} --no-chat`)
    
    
    // deactivate docker node (cayetano math)
    await program.chat.message(`Deactivate cayetano math (docker node)..`)
    let manager = await new SSHClient().connect({host: cfg.locations[host.location].web1, username: 'root'})
    await manager.exec(`docker node update --availability drain ${INSTANCE}`)
    await manager.exec(`sleep 2 && docker node inspect --pretty ${INSTANCE} | grep Availability`)
    await program.confirm('Is it drained?')
    
    
    // stop crontab on web1
    if(WEB === 'web1'){
        await program.chat.message(`Stopping cron jobs..`)
        let ssh = await new SSHClient().connect({host: host.ip, username: 'root'})
        await ssh.exec('systemctl stop crontab') // it will be auto started after the vm restart
        await ssh.disconnect()
        await program.sleep(60, 'Waiting cronjobs to finish just in case')
    }
    
    // gcloud compute instances stop NAME
    await program.confirm('Stop the VM?')
    await program.chat.message(`Stopping VM..`)
    await shell.exec(`gcloud compute instances stop ${INSTANCE}`)
    
    
    // gcloud compute instances set-machine-type NAME --machine-type custom-4-1024 4=4vCPU, 1024=1G RAM
    await program.chat.message(`Changing VM resources..`)
    await shell.exec(`gcloud compute set-machine-type ${INSTANCE} \
        --custom-cpu=${host.resources.cpu} \
        --custom-memory=${host.resources.memory}
    `)
    
    
    // gcloud compute instances start NAME
    await program.chat.message(`Starting VM..`)
    await shell.exec(`gcloud compute instances start ${INSTANCE}`)
    await shell.exec(`gcloud compute instances list --filter "${INSTANCE}"`)
    await program.confirm('Is it fine?')
    
    
    // test is it php working
    await program.chat.message(`Checking is php working..`)
    await shell.exec(`node servers/php-binary/check -h ${host.name} --no-chat`)
    
    
    // activate docker node (cayetano math)
    await program.chat.message(`Activate cayetano math (docker node)..`)
    manager = await new SSHClient().connect({host: cfg.locations[host.location].web1, username: 'root'})
    await manager.exec(`docker node update --availability active ${INSTANCE}`)
    await manager.exec(`sleep 2 && docker node inspect --pretty ${INSTANCE} | grep Availability`)
    await program.confirm('Is it available?')
    if(cfg.locations[host.location].webs.length === 2) { // special case when the location has only 2 webs
        await program.chat.message(`Redistribute services across the 2 webs..`)
        await manager.exec(`docker service update --force cayetano_math`)
    }
    await manager.disconnect()
    
    
    // enable operators
    await program.chat.message(`Activate traffic to ${WEB}`)
    await shell.exec(`node servers/nginx/switch-webs-by-location -l ${host.location} -w all --no-chat`)
    
    
})
