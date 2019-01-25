#!/usr/bin/env node
'use strict';

const Program = require('dopamine-toolbox').Program
const SSHClient = require('dopamine-toolbox').SSHClient
const cfg = require('configurator')

const DEST = '/opt/dopamine/safeguard'
const HOSTS = Object.keys(cfg.hosts).filter(h => h.includes('master') && !h.includes('replication'))

let program = new Program({chat: cfg.chat.rooms.devops})

program
    .description('Updating safeguard version')
    .option('-h, --hosts <list|all>', 'The target host names', { choices: HOSTS, required: true })
    .option('-r, --rev <tag>', 'The target version as tag name', {required: true})
    
    .iterate('hosts', async (host) => {
        let ssh = new SSHClient()
        await ssh.connect({host: cfg.getHost(host).ip, username: 'root'})
        
        await ssh.chdir(DEST)
        await ssh.exec('git fetch --prune origin')
        
        console.info('\n2. Deploy')
        await ssh.exec(`
            git reset --hard ${program.params.rev}
            npm install --no-optional
            
            systemctl restart safeguard')
            systemctl status safeguard | head -n 3
        `)
        
        console.info('The version is updated to ' + program.params.rev)
        await ssh.disconnect()
    })

