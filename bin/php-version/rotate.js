#!/usr/bin/env node
'use strict';

/**
 * Usage:
 * $ node bin/sys-metrics/rotate --host dev-hermes-web1
 */


let Deployer = require('deployer2')
let deployer = new Deployer()


deployer
    .option('-h, --host <name>', 'The target host name (all hosts are predefined in deployer configuration)')
   
    .run(async () => {
        let ssh = await deployer.ssh(deployer.params.host, 'root')
        await ssh.exec('/opt/servers-conf/php/php-fpm-reopenlogs')
    })

