#!/usr/bin/env node
'use strict';

/**
 * Usage:
 * $ node bin/sys-metrics/check --hosts all --revision v3.2.5
 */


const Program = require('dopamine-toolbox').Program
const installed = require('./.installed.json')
const cfg = require('configurator')
let program = new Program({ chat: cfg.chat.rooms.devops })


program
    .description('Updating sys-metrics version')
    .option('-h, --hosts <list|all>', 'The target host names', { choices: installed.hosts, required: true })
    .option('-r, --revision <tag>', 'The target version as tag name', {required: true})
    .loop('hosts')

    .run(async (host) => {

        let ssh = await program.ssh(cfg.getHost(host).ip, 'root')
        
        console.info('\n1. Fetch from the remote:')
        
        await ssh.chdir('/opt/dopamine/sys-metrics')
        await ssh.exec('git fetch --prune origin')
        
        console.info('\n2. Deploy')
        await ssh.exec('git reset --hard ' + program.params.revision)
        await ssh.exec('systemctl restart sys-metrics')
        await ssh.exec('systemctl status sys-metrics | head -n 3')
        
        console.info('The version is updated to latest revision')
        
    })

