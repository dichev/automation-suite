#!/usr/bin/env node
'use strict';

/**
 * Usage:
 * $ node bin/sys-metrics/stop --hosts dev-hermes-web1,dev-hermes-web2
 * $ node bin/sys-metrics/stop --hosts all
 */


const Program = require('dopamine-toolbox').Program
const installed = require('./.installed.json')
const cfg = require('configurator')
let program = new Program(cfg.devops)


program
    .option('-h, --hosts <list|all>', 'The target host names', { choices: installed.hosts })
    .loop('hosts')

    .run(async (host) => {
        let ssh = await program.ssh(cfg.getHost(host).ip, 'root')
        
        await ssh.chdir('/opt/dopamine/sys-metrics')
        await ssh.exec('systemctl stop sys-metrics')
        await ssh.exec('systemctl status sys-metrics | head -n 3')
    })

