#!/usr/bin/env node
'use strict';

const Program = require('dopamine-toolbox').Program
const SSHClient = require('dopamine-toolbox').SSHClient
const GoogleChat = require('dopamine-toolbox').plugins.GoogleChat
const cfg = require('configurator')

let program = new Program({ chat: cfg.chat.rooms.devops })


program
    .icon(GoogleChat.icons.DEPLOY)
    .description('Deploy cayetano docker swarm')
    .option('-l, --locations <list|all>', 'The target host name', {choices: Object.keys(cfg.locations), required: true})

    .iterate('locations', async (location) => {
        let web1 = await new SSHClient().connect({ host: cfg.locations[location].hosts.web1, username: 'root' })
        
        
        await web1.chdir('/opt/docker-conf')
        await web1.exec('git pull')
        await web1.exec('docker stack deploy --with-registry-auth -c cayetano-stack.yml cayetano')
        // await web1.exec('watch -n 1 docker stack ps cayetano')
        console.log('Check this on web1:\n  watch -n 1 docker stack ps cayetano')
        
        await web1.disconnect()
    })

