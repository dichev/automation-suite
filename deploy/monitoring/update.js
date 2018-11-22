#!/usr/bin/env node
'use strict';

const Program = require('dopamine-toolbox').Program
const cfg = require('configurator')

let program = new Program({ chat: cfg.chat.rooms.devops })

program
    .description('Update Grafana-Sensors repo')
    .example(`
        node deploy/monitoring/update
    `)
    .run(async () => {
        await program.confirm(`Warning! You're going to update to the last revision.\nDo you want to continue?`)
        
        let ssh     = await program.ssh(cfg.hosts.monitoring.ip, 'dopamine')
        let sshRoot = await program.ssh(cfg.hosts.monitoring.ip, 'root')
    
        let chat  = program.chat
        let shell = program.shell()
    
        try {
            await shell.exec(`node deploy/monitoring/check --quiet`)
        } catch (e) {
            await program.ask('WARNING! Some test failed! Are you sure you want to continue?', ['yes', 'no'], 'yes')
        }
    
        // Update repo
        await ssh.chdir('/home/dopamine/grafana-sensors')
        await chat.notify('Updating repo to last revision')
        await ssh.exec(`git fetch --prune && git pull`)

        // Update configurator
        await chat.notify('Updating ONLY configurator')
        await ssh.exec(`npm update --force configurator`)

        // Restart
        await chat.notify('Restart grafana-sensors.service')
        await sshRoot.exec(`systemctl restart grafana-sensors.service`)

        await program.sleep(2)

        // Check
        await chat.notify('Check grafana-sensors.service status')
        await sshRoot.exec(`systemctl status grafana-sensors.service | head -n 3`)
    })