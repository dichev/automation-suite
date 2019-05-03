#!/usr/bin/env node
'use strict';

const Program = require('dopamine-toolbox').Program
const SSHClient = require('dopamine-toolbox').SSHClient
const cfg = require('configurator')

const DEST = '/opt/dopamine/safeguard'

let program = new Program({chat: cfg.chat.rooms.devops})

program
    .description('Updating safeguard version')
    .option('-l, --locations <list|all>', 'The target location (will be used web1)', { choices: Object.keys(cfg.locations), required: true })
    .option('-r, --rev <tag>', 'The target version as tag name', {required: true})
    
    .iterate('locations', async (location) => {
        let ssh = new SSHClient()
        await ssh.connect({host: cfg.locations[location].hosts.web1, username: 'root'})
        
        await ssh.chdir(DEST)
        await ssh.exec('git fetch --prune origin')
        await ssh.exec(`
            git reset --hard ${program.params.rev}
            echo "Reinstalling npm packages.."
            npm install --no-optional
            
            systemctl enable safeguard
            systemctl restart safeguard
            systemctl status safeguard | head -n 3
        `)
        
        console.info('The version is updated to ' + program.params.rev)
        await ssh.disconnect()
    })

