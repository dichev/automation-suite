#!/usr/bin/env node
'use strict';

/**
 * Usage:
 * $ node bin/servers-conf/update-nginx-only --hosts dev-hermes-lb
 */

const Deployer = require('deployer2')
const cfg = require('configurator')
const installed = require('./.installed.json')

let deployer = new Deployer(cfg.devops)
deployer
    .description('Updating nginx configuration')
    .option('-h, --hosts <list|all>', 'The target host name', {choices: installed.hosts})
    .loop('hosts')
    .run(async (host) => {
    
        let ssh = await deployer.ssh(cfg.getHost(host).ip, 'root')
        await ssh.exec('auto-update-configs --only-nginx')
    })
