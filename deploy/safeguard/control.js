#!/usr/bin/env node
'use strict';

const Program = require('dopamine-toolbox').Program
const SSHClient = require('dopamine-toolbox').SSHClient
const cfg = require('configurator')

const DEST = '/opt/dopamine/safeguard'
const HOSTS = Object.keys(cfg.hosts).filter(h => h.includes('master') && !h.includes('replication'))

let program = new Program({chat: cfg.chat.rooms.devops})

program
    .option('-h, --hosts <list|all>', 'The target host names', { choices: HOSTS, required: true })
    .option('--mode <stop|start|restart>', 'The systemctl command to be executed', { choices: ['stop','start','restart'], required: true })
    
    .iterate('hosts', async (host) => {
        let ssh = new SSHClient()
        await ssh.connect({host: cfg.getHost(host).ip, username: 'root'})
        
        await ssh.exec(`systemctl ${program.params.mode} safeguard`)
        await ssh.exec('systemctl status safeguard | head -n 3')
    
        await ssh.disconnect()
    })

