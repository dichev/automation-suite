#!/usr/bin/env node
'use strict';

/**
 * Usage:
 * $ node bin/sys-metrics/swith --host dev-hermes-web1 --version  7.1.9
 */


let Deployer = require('deployer2')
let deployer = new Deployer()


deployer
    .option('-h, --host <name>', 'The target host name (all hosts are predefined in deployer configuration)')
    .option('-p --php-version NUMBER') /* ne sam siguren dali -v i --version e nau-udachnoto */
   
    .run(async () => {
    	console.info('Switching php version to:'+deployer.params.version)
        let ssh = await deployer.ssh(deployer.params.host, 'root')
        await ssh.exec('rm /opt/phpbrew/php/php')
        await ssh.exec('ln -s /opt/phpbrew/php/php'+ deployer.params.version + ' /opt/phpbrew/php/php')
        console.info('Done')
    })

