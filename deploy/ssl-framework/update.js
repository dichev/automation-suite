#!/usr/bin/env node
'use strict';

const Program = require('dopamine-toolbox').Program
const cfg = require('configurator')

let program = new Program({ chat: cfg.chat.rooms.devops })

program
.description('Update SSL-Framework')
.example(`
        node deploy/ssl-framework/update
    `)
.run(async () => {
    await program.confirm(`Warning! You're going to update to the last revision.\nDo you want to continue?`)

    let ssh     = await program.ssh(cfg.hosts['sofia-devops-monitoring'].ip, 'dopamine')
    let sshRoot = await program.ssh(cfg.hosts['sofia-devops-monitoring'].ip, 'root')

    let chat  = program.chat
    let shell = program.shell()

    try {
        await shell.exec(`node deploy/ssl-framework/check --quiet`)
    } catch (e) {
        await program.ask('WARNING! Some test failed! Are you sure you want to continue?', ['yes', 'no'], 'yes')
    }

    // Update repo
    await ssh.chdir('/opt/dopamine/ssl-server-framework')
    await chat.notify('Updating repo to last revision')
    await ssh.exec(`git fetch --prune && git pull`)

    // Update configurator
    await chat.notify('Updating ONLY configurator')
    await ssh.exec(`npm install configurator`)

    // Restart
    await chat.notify('Restart ssl-server-framework.service')
    await sshRoot.exec(`systemctl restart ssl-server-framework.service`)

    await program.sleep(2)

    // Check
    await chat.notify('Check ssl-server-framework.service status')
    await sshRoot.exec(`systemctl status ssl-server-framework.service | head -n 3`)
})