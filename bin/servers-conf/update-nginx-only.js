#!/usr/bin/env node
'use strict';

/**
 * Usage:
 * $ node bin/servers-conf/update-nginx-only --host dev-hermes-lb
 */

const Deployer = require('deployer2')
let deployer = new Deployer()
deployer
    .option('-h, --host <dev-hermes-lb|belgium-lb1>', 'The target host name (all hosts are predefined in deployer configuration)')
   
    .run(async () => {
    
        let ssh = await deployer.ssh(deployer.params.host, 'root')
        await ssh.exec('auto-update-configs --nginx-only')
        await ssh.disconnect()
        
    })
