#!/usr/bin/env node
'use strict';

/**
 * Usage:
 * $ node bin/sys-metrics/fpm --host dev-hermes-web1 --action start
 */


let Deployer = require('deployer2')
let deployer = new Deployer()


deployer
    .option('-h, --host <name>', 'The target host name (all hosts are predefined in deployer configuration)')
    .option('-a, --action start, restart or stop') /* nqkakwa proverka da priema samo trite stoinosti */
   
    .run(async () => {
        let ssh = await deployer.ssh(deployer.params.host, 'root')
        await ssh.exec('/etc/init.d/php-fpm '+ deployer.params.action)
    })

