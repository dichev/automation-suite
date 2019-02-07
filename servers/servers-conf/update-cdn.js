#!/usr/bin/env node
'use strict';

const Program = require('dopamine-toolbox').Program
const SSHClient = require('dopamine-toolbox').SSHClient
const cfg = require('configurator')
const HOSTS = Object.values(cfg.hosts).filter(h => h.type === 'cdn').map(h => h.name)

let program = new Program({ chat: cfg.chat.rooms.devops })

program
    .description('Update servers configuration of CDN')
    .option('-h, --hosts <list|all>', `Comma-separated list of cdn regions`, {choices: HOSTS, required: true})
    .option('-r, --revision <string>', `Target git revision or branch`, { def: 'origin/master'})
    .option('-f, --force', 'Skip manual changes validations and proceed on your risk')

    .iterate('hosts', async (host) => {
        const REV = program.params.revision

        // Update cdn files
        let ssh = await new SSHClient().connect({host: cfg.getHost(host).ip, username: 'root'})
        await ssh.chdir('/opt/servers-conf')
    
    
        if (!program.params.force) {
            console.log('Checking for manual changes')
            let changes = await ssh.exec(`git status --short --untracked-files=no`)
            if (changes) throw Error(`Aborting.. Manual changes found at ${host}`)
            let branch = await ssh.exec(`git rev-parse --abbrev-ref HEAD`, {silent: true})
            if (branch !== 'master') throw Error(`Aborting.. Manual changes found at ${host}. The repo is not on master, but is on branch ${branch}`)
        }
    
        await program.chat.message(`Updating repo to ${REV}`)
        await ssh.exec('git fetch --prune origin --quiet')
        await ssh.exec(`git reset --hard ${REV}`)
    
    
        await program.chat.message('Reloading configuration of nginx..')
        await ssh.exec(`nginx -s reload`)
        
        await ssh.disconnect()
    })
