#!/usr/bin/env node
'use strict';

process.argv.push('--quiet')

const Program = require('dopamine-toolbox').Program
const cfg = require('configurator')

let program = new Program({chat: false})

program
    .description('generate ssh_config file')
    .option('-u, --user <string>', `User for remote login`)
    .option('-i, --identity <string>', `Identity file location`)
    .option('-h, --hosts <list|all>', `Comma-separated list of hosts`, {choices: Object.keys(cfg.hosts), required: true})
    .iterate('hosts', async (host) => {
        host = cfg.hosts[host]
        console.log(`
Host ${host.name}
    HostName ${host.ip}
    User ${program.params.user}
    Port 22
    IdentityFile ${program.params.identity}
`)

    })
