#!/usr/bin/env node
'use strict';

/**
 * Usage:
 * $ node bin/php-binary/swith --host dev-hermes-web1 --version  7.1.9
 */


const Deployer = require('deployer2')
const installed = require('./.installed.json')
const cfg = require('configurator')
let deployer = new Deployer(cfg.devops)

deployer

    .option('-h, --hosts <list|all>', 'The target host name', {choices: installed.hosts})
    .option('-p, --phpversion <version>', 'The php version number', {choices: installed.versions, def: '7.1.19'})
    .loop('hosts')

    .run(async (host) => {
    	console.info('Switching php version to: '+deployer.params.phpversion)
	let ssh = await deployer.ssh(cfg.hosts.get(host).ip, 'root')
        await ssh.exec('rm /opt/phpbrew/php/php')
        await ssh.exec('ln -s /opt/phpbrew/php/php-'+ deployer.params.phpversion + ' /opt/phpbrew/php/php')
        console.info('Done')
	deployer.chat.notify('php version switched to '+ deployer.params.phpversion + ' on ' + host, {color: 'green'})
    })

