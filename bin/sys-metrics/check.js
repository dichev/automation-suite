#!/usr/bin/env node
'use strict';

/**
 * Usage:
 * $ node bin/sys-metrics/check --hosts dev-hermes-web1,dev-hermes-web2
 * $ node bin/sys-metrics/check --hosts all
 */


const Deployer = require('deployer2')
const installed = require('./.installed.json')
let deployer = new Deployer({hosts: installed.hosts})


deployer
    .option('-h, --hosts <list|all>', 'The target host names', { choices: installed.hosts })
   
    .loop('hosts', async (host) => {
        let ssh = await deployer.ssh(host, 'root')
    
        await ssh.exec('cd /opt/dopamine/sys-metrics && git describe --tags')
        await ssh.exec('systemctl status sys-metrics | grep Active')
    })

