#!/usr/bin/env node
'use strict';

/**
 * Usage:
 * $ node bin/servers-conf/check-changes --hosts belgium-lb
 */

const Deployer = require('deployer2')
const cfg = require('configurator')
const installed = require('./.installed.json')

let deployer = new Deployer(cfg.devops)
deployer
    .option('-h, --hosts <list|all>', 'The target host name', {choices: installed.hosts})
    .loop('hosts')
    .run(async (host) => {
        
        let ssh = await deployer.ssh(cfg.getHost(host).ip, 'root')
        await ssh.chdir('/opt/servers-conf')
        await ssh.exec('git fetch origin master --quiet')
        await ssh.exec('git log HEAD..origin/master --oneline')
        await ssh.exec('git diff HEAD..origin/master --name-status')
    })
