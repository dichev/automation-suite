#!/usr/bin/env node
'use strict';

/**
 * Usage:
 * $ node bin/sys-metrics/init --hosts dev-hermes-web1
 */


const Program = require('dopamine-toolbox').Program
const installed = require('./.installed.json')
const fs = require('fs')
const cfg = require('configurator')

let program = new Program(cfg.devops)


program
    .description('Installing sys-metrics')
    .option('-h, --hosts <list>', 'The target host names')
    .loop('hosts')
    // .save('./installed')

    .run(async (host) => {
        if(installed.hosts.includes(host)) throw Error(`This host ${host} is already installed`)

        let ssh = await program.ssh(cfg.getHost(host).ip, 'root')
        
        await ssh.exec(`
            ssh-keyscan -H gitlab.dopamine.bg >> ~/.ssh/known_hosts
            ssh-keyscan -H monitoring.d >> ~/.ssh/known_hosts
            
            apt-get update
            apt-get -y install curl git
            curl -sL https://deb.nodesource.com/setup_8.x | bash -
            apt-get -y install nodejs
        `)
        
        await ssh.exec('mkdir -p /opt/dopamine/sys-metrics')
        await ssh.chdir('/opt/dopamine/sys-metrics')
        await ssh.exec('git clone git@gitlab.dopamine.bg:releases/sys-metrics.git .')
        await ssh.exec('systemctl enable /opt/dopamine/sys-metrics/sys-metrics.service')
        await ssh.exec('systemctl start sys-metrics')
        await ssh.exec('systemctl status sys-metrics | head -n 3')
        
        console.info('Sys metrics are deployed successfully and now are active!')

        installed.hosts.push(host)
        fs.writeFileSync(__dirname + '/.installed.json', JSON.stringify(installed, null, 4))
    })

