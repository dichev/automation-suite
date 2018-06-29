#!/usr/bin/env node
'use strict';

/**
 * Usage:
 * $ node bin/sys-metrics/restart --hosts dev-hermes-web1,dev-hermes-web2
 * $ node bin/sys-metrics/restart --hosts all
 */


const Deployer = require('deployer2')
const installed = require('./.installed.json')
let deployer = new Deployer({hosts: installed.hosts})


deployer
    .option('-h, --hosts <list|all>', 'The target host names', { choices: installed.hosts })
   
    .loop('hosts', async (host) => {
        let ssh = await deployer.ssh(deployer.params.host, 'root')
        
        await ssh.chdir('/opt/dopamine/sys-metrics')
        await ssh.exec('systemctl restart sys-metrics')
        await ssh.exec('systemctl status sys-metrics | head -n 3')
        
    })

