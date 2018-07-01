#!/usr/bin/env node
'use strict';

/**
 * Usage:
 * $ node bin/servers-conf/update-nginx-and-webs --hosts dev-hermes-lb
 */

const Deployer = require('deployer2')
const HOSTS = require('configurator').hosts
const installed = require('./.installed.json')

let deployer = new Deployer()
deployer
    .option('-h, --hosts <list|all>', 'The target host name', {choices: installed.hosts})
    .loop('hosts')
    .run(async (host) => {
    
        let ssh = await deployer.ssh(HOSTS.get(host).ip, 'root')
        await ssh.exec('auto-update-configs')
        await ssh.disconnect()
        
    })
