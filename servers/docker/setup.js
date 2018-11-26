#!/usr/bin/env node
'use strict';

const Program = require('dopamine-toolbox').Program
const SSHClient = require('dopamine-toolbox').SSHClient
const GoogleChat = require('dopamine-toolbox').plugins.GoogleChat
const cfg = require('configurator')

let program = new Program({ chat: cfg.chat.rooms.devops })


program
    .icon(GoogleChat.icons.DEPLOY)
    .description('Setup docker on all web instances')
    .option('-h, --hosts <list|all>', 'The target host name', {choices: Object.keys(cfg.hosts), required: true})

    .iterate('hosts', async (host) => {
        console.log('Installing docker-ce according their manual:\n https://docs.docker.com/install/linux/docker-ce/debian/#install-docker-ce')
        
        let web = await new SSHClient().connect({host: cfg.getHost(host).ip, username: 'root'})
        
    
        console.log('Installing packages..')
        await web.exec(`
            set -e
            apt-get -qq update
            apt-get -q -y install software-properties-common
            
            curl -fsSL https://download.docker.com/linux/debian/gpg | apt-key add -
            add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/debian $(lsb_release -cs) stable"
            
            apt-get -qq update
            apt-get -q -y install docker-ce
        `)

        
        console.log('\n\nChecking docker version')
        await web.exec('docker -v')
        await web.disconnect()
        
    })

