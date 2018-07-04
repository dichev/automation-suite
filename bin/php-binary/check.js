#!/usr/bin/env node
'use strict';

/**
 * Usage:
 * $ node bin/sys-metrics/check --host dev-hermes-web1
 */


const Deployer = require('deployer2')
const installed = require('./.installed.json')
const cfg = require('configurator')
let deployer = new Deployer(cfg.devops)

deployer

    .option('-h, --hosts <list|all>', 'The target host name', {choices: installed.hosts})
    .loop('hosts')

    .run(async (host) => {
	let ssh = await deployer.ssh(cfg.hosts.get(host).ip, 'root')
	try {
          await ssh.exec('/opt/servers-conf/php/php-fpm-checkconf')
	} catch  (err) {
	  deployer.chat.notify('php-fpm have a error on ' + host, {color: 'red'})
	}
    })

