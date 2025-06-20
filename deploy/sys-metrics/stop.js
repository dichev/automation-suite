#!/usr/bin/env node
'use strict';

/**
 * Usage:
 * $ node deploy/sys-metrics/stop --hosts dev-hermes-web1,dev-hermes-web2
 * $ node deploy/sys-metrics/stop --hosts all
 */


const Program = require('dopamine-toolbox').Program
const SSHClient = require('dopamine-toolbox').SSHClient
const cfg = require('configurator')
let program = new Program({ chat: cfg.chat.rooms.devops })


program
    .option('-h, --hosts <list|all>', 'The target host names', { choices: Object.keys(cfg.hosts), required: true })
    
    .iterate('hosts', async (host) => {
        let ssh = new SSHClient()
        await ssh.connect({host: cfg.getHost(host).ip, username: 'root'})
        
        await ssh.chdir('/opt/dopamine/sys-metrics')
        await ssh.exec('systemctl stop sys-metrics')
        await ssh.exec('systemctl status sys-metrics | head -n 3')
    
        await ssh.disconnect()
    })

