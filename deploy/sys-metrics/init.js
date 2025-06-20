#!/usr/bin/env node
'use strict';

/**
 * Usage:
 * $ node deploy/sys-metrics/init --hosts dev-hermes-web1
 */


const Program = require('dopamine-toolbox').Program
const SSHClient = require('dopamine-toolbox').SSHClient
const fs = require('fs')
const cfg = require('configurator')

let program = new Program({ chat: cfg.chat.rooms.devops })


program
    .description('Installing sys-metrics')
    .option('-h, --hosts <list>', 'The target host names', {required: true, choices: Object.keys(cfg.hosts) })
    .option('--install-deps', 'Install required deps in case the vm is not unified')

    .iterate('hosts', async (host) => {
        let ssh = new SSHClient()
        await ssh.connect({ host: cfg.getHost(host).ip, username: 'root' })
    
        if(program.params.installDeps){
            await ssh.exec(`
                ssh-keyscan -H gitlab.dopamine.bg >> ~/.ssh/known_hosts
                ssh-keyscan -H monitoring.d >> ~/.ssh/known_hosts
                
                apt-get update
                apt-get -y install curl git
                curl -sL https://deb.nodesource.com/setup_8.x | bash -
                apt-get -y install nodejs
            `)
        }
        
        await ssh.exec('mkdir -p /opt/dopamine/sys-metrics')
        await ssh.exec('git clone git@gitlab.dopamine.bg:releases/sys-metrics.git /opt/dopamine/sys-metrics')
        await ssh.exec('systemctl enable /opt/dopamine/sys-metrics/sys-metrics.service')
        await ssh.exec('systemctl start sys-metrics')
        await ssh.exec('systemctl status sys-metrics | head -n 3')
        
        console.info('Sys metrics are deployed successfully and now are active!')
    
        await ssh.disconnect()
    })

