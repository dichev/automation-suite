#!/usr/bin/env node
'use strict';

const Program = require('dopamine-toolbox').Program
const SSHClient = require('dopamine-toolbox').SSHClient
const cfg = require('configurator')

const DEST = '/opt/dopamine/safeguard'

let program = new Program({ chat: cfg.chat.rooms.devops })

program
    .description('Installing safeguard')
    .option('-l, --locations <list|all>', 'The target location (will be used web1)', { choices: Object.keys(cfg.locations), required: true })

    .iterate('hosts', async (host) => {
        let ssh = new SSHClient()
        await ssh.connect({host: cfg.locations[location].hosts.web1, username: 'root'})
    
        await ssh.exec(`mkdir -p ${DEST}`)
        await ssh.chdir(DEST)
        
        await ssh.exec(`
            git clone git@gitlab.dopamine.bg:analytics/safeguard.git ${DEST}
            npm install --no-optional
            systemctl enable ${DEST}/safeguard.service
            
            cp src/config/custom.config.js-PRODUCTION src/config/custom.config.js
        `)
    
        console.info(`
            Please do following manual setup:
            - nano ${DEST}/src/config/custom.config.js
            - mysql -uroot -e "CREATE DATABASE safeguard;"
            - mysql -uroot safeguard < db/schema.sql
            - mysql -uroot safeguard ${DEST}/db/permissions.sql # change password here
            
            And then start it as service:
            - systemctl start safeguard
            - journalctl -f -u safeguard
        `)
        
        await ssh.shell()
        await ssh.disconnect()
    })

