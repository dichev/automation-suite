#!/usr/bin/env node
'use strict';

const Program = require('dopamine-toolbox').Program
const cfg = require('configurator')
const SSHClient = require('dopamine-toolbox').SSHClient
const sleep = 25
let program = new Program({chat: cfg.chat.rooms.devops})

program
    .description('Proxy setup.')
    .option('-l, --locations <list|all>', 'Location', {choices: Object.keys(cfg.locations), required: true})
    .iterate('locations', async (location) => {
        let lb = cfg.locations[location].hosts.lb
        let ssh = await new SSHClient().connect({host: lb, username: 'root'})
        await ssh.chdir('/opt/dopamine/')
        let exists = await ssh.exists('/opt/dopamine/docker-conf')
        if(exists){
            await ssh.chdir('/opt/dopamine/docker-conf')
            await ssh.exec('git pull')
        }else{
            await ssh.exec('git clone git@gitlab.dopamine.bg:releases/docker-conf.git')
        }
        await ssh.chdir('/opt/dopamine/docker-conf')
        try{
            await ssh.exec('docker swarm init')
        }catch(e){
                // that's ok. Already initialized as a swarm node.
        }

        await ssh.exec('docker stack deploy --with-registry-auth -c lb-stack.yml loadbalancer')
        console.log(`Sleeping for ${sleep} sec`)
        await program.sleep(sleep)
        await ssh.exec('curl -x http://127.0.0.1:3128 -s -o /dev/null -w "%{http_code}" -I https://dopamine.bg')

        await ssh.disconnect()
    })