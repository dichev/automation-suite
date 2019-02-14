#!/usr/bin/env node
'use strict';

const Program = require('dopamine-toolbox').Program
const SSHClient = require('dopamine-toolbox').SSHClient
const cfg = require('configurator')

let program = new Program({ chat: cfg.chat.rooms.devops })


program
    .description('Setup docker on all web instances')
    .option('-h, --hosts <list|all>', 'The target host name', {choices: Object.keys(cfg.hosts), required: true})

    .iterate('hosts', async (host) => {
        console.log('Installing docker-ce according their manual:\n https://docs.docker.com/install/linux/docker-ce/debian/#install-docker-ce')
        
        let web = await new SSHClient().connect({host: cfg.getHost(host).ip, username: 'root'})
    
    
        console.log('Checking for docker:')
        try {
            await web.exec('docker -v')
            console.warn('Docker is already installed, skipping..')
            return await web.disconnect()
        } catch (err) {
            // that's fine
        }
        
    
        console.log('\nInstalling packages..')
        await web.exec(`
            apt-get -qq update
            apt-get install -q -y apt-transport-https ca-certificates curl gnupg2 software-properties-common

            curl -fsSL https://download.docker.com/linux/debian/gpg | apt-key add - 
            add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/debian $(lsb_release -cs) stable"

            apt-get -qq update
            apt-get install -q -y docker-ce docker-ce-cli containerd.io
        `)

        
        console.log('\n\nChecking docker version')
        await web.exec('docker -v')
        
        
        console.log('Configure gcloud auth')
        await web.exec('gcloud auth configure-docker --quiet')
        
        await web.disconnect()
        
    })

