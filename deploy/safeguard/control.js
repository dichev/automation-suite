#!/usr/bin/env node
'use strict';

const Program = require('dopamine-toolbox').Program
const SSHClient = require('dopamine-toolbox').SSHClient
const cfg = require('configurator')

const DEST = '/opt/dopamine/safeguard'
let LOCATIONS = Object.values(cfg.locations).filter(l => l.production === true).map(l => l.name)

let program = new Program({chat: cfg.chat.rooms.devops})

program
    .option('-l, --locations <list|all>', 'The target location (will be used web1)', { choices: LOCATIONS, required: true })
    .option('--mode <stop|start|restart>', 'The systemctl command to be executed', { choices: ['stop','start','restart'], required: true })
    
    .iterate('locations', async (location) => {
        let ssh = new SSHClient()
        await ssh.connect({host: cfg.locations[location].hosts.web1, username: 'root'})
        
        await ssh.exec(`systemctl ${program.params.mode} safeguard`)
        await ssh.exec('systemctl status safeguard | head -n 3')
    
        await ssh.disconnect()
    })

