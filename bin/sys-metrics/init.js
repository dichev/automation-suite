#!/usr/bin/env node
'use strict';

/**
 * Usage:
 * $ node bin/sys-metrics/init --host dev-hermes-web1
 */


const Deployer = require('deployer2')
let deployer = new Deployer()


deployer
    .option('-h, --host <name>', 'The target host name (all hosts are predefined in deployer configuration)')
   
    .run(async () => {
        let ssh = await deployer.ssh(deployer.params.host, 'root')
        
        ssh.exec(`
            ssh-keyscan -H gitlab.dopamine.bg >> ~/.ssh/known_hosts
            ssh-keyscan -H monitoring.d >> ~/.ssh/known_hosts
            
            apt-get update
            apt-get -y install curl git
            curl -sL https://deb.nodesource.com/setup_8.x | bash -
            apt-get -y install nodejs
        `)
        
        ssh.exec('mkdir -p /opt/dopamine/sys-metrics')
        ssh.chdir('/opt/dopamine/sys-metrics')
        ssh.exec('git clone git@gitlab.dopamine.bg:releases/sys-metrics.git .')
        ssh.exec('systemctl enable /opt/dopamine/sys-metrics/sys-metrics.service')
        ssh.exec('systemctl start sys-metrics')
        ssh.exec('systemctl status sys-metrics | head -n 3')
        
        console.info('Sys metrics are deployed successfully and now are active!')
    })

