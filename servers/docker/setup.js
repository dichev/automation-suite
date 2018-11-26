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
    .option('-l, --locations <list|all>', 'The target location name', {choices: Object.keys(cfg.locations), required: true})

    .iterate('locations', async (location) => {
        console.log('Installing docker-ce according their manual:\n https://docs.docker.com/install/linux/docker-ce/debian/#install-docker-ce')
        
        let webs = []
        for (let web of cfg.locations[location].hosts.webs) {
            if(web.ip === '10.132.23.111') continue
            webs.push(await new SSHClient().connect({host: web.ip, username: 'root'}))
        }
    
        console.log('Installing packages..')
        for(let web of webs){
            await web.exec(`
                set -e
                apt-get -q update
                apt-get -q -y install software-properties-common
                
                curl -fsSL https://download.docker.com/linux/debian/gpg | apt-key add -
                add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/debian $(lsb_release -cs) stable"
                
                apt-get -q update
                apt-get -q -y install docker-ce
            `)
        }

        
        console.log('Checking docker version')
        for (let web of webs) {
            await web.exec('docker -v')
            await web.disconnect()
        }
        
    })

