#!/usr/bin/env node
'use strict';

const Program = require('dopamine-toolbox').Program
const SSHClient = require('dopamine-toolbox').SSHClient
const Shell = require('dopamine-toolbox').Shell
const GoogleChat = require('dopamine-toolbox').plugins.GoogleChat
const cfg = require('configurator')

let program = new Program({ chat: cfg.chat.rooms.deployBackend })


program
    .icon(GoogleChat.icons.DEPLOY)
    .description('Deploy cayetano docker swarm')
    .option('-l, --locations <list|all>', 'The target host name', {choices: Object.keys(cfg.locations), required: true})

    .iterate('locations', async (location) => {
        let web1 = await new SSHClient().connect({ host: cfg.locations[location].hosts.web1, username: 'root' })
        
        
        await web1.chdir('/opt/dopamine/docker-conf')
        await web1.exec('git pull')
        
        
        let image = (await web1.exec('cat cayetano-stack.yml  | grep image | grep cayetano-math')).trim().replace('image:', '').trim()
        if(!image) throw Error('Wrong configiration, there is no image for the cayetan-math')
        console.log(`Pulling ${image} on all webs to speed up the deploy populating`)
        for(let web of cfg.locations[location].hosts.webs){
            let ssh = await new SSHClient().connect({host: web.ip, username: 'root'})
            await ssh.exec(`docker pull ${image}`)
            await ssh.disconnect()
        }
        
        
        await program.confirm('Deploy the new version?')
        await web1.exec('docker stack deploy --with-registry-auth -c cayetano-stack.yml cayetano')
        // await web1.exec('watch -n 1 docker stack ps cayetano')
        
        let shell = new Shell()
        await shell.exec(`node deploy/cayetano/check -l ${location}`)
        
        console.log('\nNote it\'s expected delay during containers update.')
        console.log('Check the versions using:')
        console.log(`  node servers/executor/exec -h ${location}-web1 -e "docker stack ps cayetano --filter 'name=cayetano_math'"`)
        
        await web1.disconnect()
    })

