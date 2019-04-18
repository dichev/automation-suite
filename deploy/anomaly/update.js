#!/usr/bin/env node
'use strict';

const Program = require('dopamine-toolbox').Program
const cfg = require('configurator')

let program = new Program({ chat: cfg.chat.rooms.devops })

program
    .description('Update Anomaly docker')
    .example(`
        node deploy/anomaly/update
    `)
    .run(async () => {
        await program.confirm(`Warning! You're going to update to the last revision.\nDo you want to continue?`)
        
        let ssh     = await program.ssh(cfg.hosts['sofia-devops-monitoring'].ip, 'dopamine')
        let sshRoot = await program.ssh(cfg.hosts['sofia-devops-monitoring'].ip, 'root')
    
        let chat  = program.chat
        let shell = program.shell()
    
        try {
            await shell.exec(`node deploy/anomaly/check --quiet`)
        } catch (e) {
            await program.ask('WARNING! Some test failed! Are you sure you want to continue?', ['yes', 'no'], 'yes')
        }
    
        // Update repo
        await ssh.chdir('/opt/dopamine/anomaly')
        await chat.notify('Updating repo to last revision')
        
        await sshRoot.exec(`chown -R dopamine:dopamine /opt/dopamine/anomaly/`)

        await ssh.exec(`git reset --hard`) // removing package*.json
        await ssh.exec(`git fetch --prune && git pull`)

        // login, build, push docker image
        await sshRoot.chdir('/opt/dopamine/anomaly')
        await sshRoot.exec(`bash buildDocker.sh`)
        await ssh.exec(`git reset --hard`) // removing package*.json

        await program.sleep(1)

        // deploy prodmon stack
        await shell.exec(`node deploy/prodmon/update.js`)

        await chat.notify('Done')
    })