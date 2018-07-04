#!/usr/bin/env node
'use strict';

/**
 * Usage:
 * $ node bin/sys-metrics/fpm --host dev-hermes-web1 --action start
 */



const Deployer = require('deployer2')
const installed = require('./.installed.json')
const cfg = require('configurator')
let deployer = new Deployer(cfg.devops)

deployer

    .option('-h, --hosts <list|all>', 'The target host name', {choices: installed.hosts})
    .option('-a, --action <action>', 'Use start, restart, stop')
    .loop('hosts')

    .run(async (host) => {
        let ssh = await deployer.ssh(cfg.hosts.get(host).ip, 'root')
	try {
          await ssh.exec('/etc/init.d/php-fpm '+ deployer.params.action)
        } catch  (err) {
          deployer.chat.notify('php-fpm dont ' + deployer.params.action ' on '  + host, {color: 'red'})
        }

    })

