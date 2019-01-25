#!/usr/bin/env node
'use strict';

const Program = require('dopamine-toolbox').Program
const SSHClient = require('dopamine-toolbox').SSHClient
const cfg = require('configurator')

const DEST = '/opt/dopamine/safeguard'
const HOSTS = Object.keys(cfg.hosts).filter(h => h.includes('master') && !h.includes('replication'))

let program = new Program({ chat: cfg.chat.rooms.devops })

program
    .description('Installing safeguard')
    .option('-h, --hosts <list>', 'The target database group', {required: true, choices: HOSTS })

    .iterate('hosts', async (host) => {
        let ssh = new SSHClient()
        await ssh.connect({ host: cfg.hosts[host].ip, username: 'root' })
    
        process.exit()
        await ssh.exec(`mkdir -p ${DEST}`)
        await ssh.chdir(DEST)
        
        await ssh.exec(`
            git clone git@gitlab.dopamine.bg:analytics/safeguard.git ${DEST}
            npm install --no-optional
            systemctl enable ${DEST}/safeguard.service
            
            cp src/config/custom.config.js-PRODUCTION src/config/custom.config.js
            
            mysql -uroot -e "CREATE DATABASE safeguard;"
            mysql -uroot safeguard < db/schema.sql
        `)
    
        console.info(`
            Please do following manual setup:
            - nano ${DEST}/src/config/custom.config.js
            - cat ${DEST}/db/permissions.sql
            
            And then start it as service:
            - systemctl start safeguard
            - journalctl -f -u safeguard
        `)
        
        await ssh.shell()
        await ssh.disconnect()
    })

