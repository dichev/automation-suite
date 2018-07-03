#!/usr/bin/env node
'use strict';

/**
 * Usage:
 * $ node bin/sys-metrics/swith --host dev-hermes-web1 --version  7.1.9
 */


let Deployer = require('deployer2')
const cfg = require('configurator')
const installed = require('./.installed.json')

let deployer = new Deployer(cfg.devops)


deployer
    .option('-h, --hosts <list|all>', 'The target host name', {choices: installed.hosts})
    .option('-p, --phpversion NUMBER') 
    .loop('hosts')
   
    .run(async () => {
    	console.info('Switching php version to:'+deployer.params.phpversion)
	let ssh = await deployer.ssh(cfg.hosts.get(host).ip, 'root')
        await ssh.exec('rm /opt/phpbrew/php/php')
        await ssh.exec('ln -s /opt/phpbrew/php/php'+ deployer.params.phpversion + ' /opt/phpbrew/php/php')
        console.info('Done')
    })

