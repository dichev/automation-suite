#!/usr/bin/env node
'use strict';

/**
 * Usage:
 * $ node bin/sys-metrics/check --hosts dev-hermes-web1,dev-hermes-web2
 * $ node bin/sys-metrics/check --hosts dev-hermes-*
 * $ node bin/sys-metrics/check --hosts all
 */


const Deployer = require('deployer2')
const installed = require('./.installed.json')
const cfg = require('configurator')
let deployer = new Deployer(cfg.devops)


deployer
    .option('-h, --hosts <list|all>', 'The target host names', { choices: installed.hosts })
    .loop('hosts')

    .run(async (host) => {
        let ssh = await deployer.ssh(cfg.getHost(host).ip, 'root')
       
        await ssh.exec('cd /opt/dopamine/sys-metrics && git describe --tags')
        await ssh.exec('systemctl status sys-metrics | grep Active')
    })

