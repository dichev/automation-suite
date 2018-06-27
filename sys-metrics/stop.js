#!/usr/bin/env node
'use strict';

/**
 * Usage:
 * $ node sys-metrics/stop --host dev-hermes-web1
 */


let Deployer = require('deployer2')
let deployer = new Deployer()


deployer
    .option('-h, --host <name>', 'The target host name (all hosts are predefined in deployer configuration)')
   
    .run(async () => {
        let ssh = await deployer.ssh(deployer.params.host, 'root')
        
        await ssh.chdir('/opt/dopamine/sys-metrics')
        await ssh.exec('systemctl stop sys-metrics')
        await ssh.exec('systemctl status sys-metrics | head -n 3')
    })

