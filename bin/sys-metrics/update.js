#!/usr/bin/env node
'use strict';

/**
 * Usage:
 * $ node bin/sys-metrics/check --hosts all --revision v3.2.5
 */


const Deployer = require('deployer2')
const installed = require('./.installed.json')
const HOSTS = require('configurator').hosts
let deployer = new Deployer()


deployer
    .option('-h, --hosts <list|all>', 'The target host names', { choices: installed.hosts })
    .option('-r, --revision <tag>', 'The target version as tag name')
    .loop('hosts')

    .run(async (host) => {

        let ssh = await deployer.ssh(HOSTS.get(host).ip, 'root')
        
        console.info('\n1. Fetch from the remote:')
        
        await ssh.chdir('/opt/dopamine/sys-metrics')
        await ssh.exec('git fetch --prune origin')
        
        console.info('\n2. Deploy')
        await ssh.exec('git reset --hard ' + deployer.params.revision)
        await ssh.exec('systemctl restart sys-metrics')
        await ssh.exec('systemctl status sys-metrics | head -n 3')
        
        console.info('The version is updated to latest revision')
        
    })

