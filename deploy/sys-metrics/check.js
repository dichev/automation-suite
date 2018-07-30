#!/usr/bin/env node
'use strict';


const Program = require('dopamine-toolbox').Program
const installed = require('./.installed.json')
const cfg = require('configurator')
let program = new Program({ chat: cfg.chat.rooms.devops })


program
    .option('-h, --hosts <list|all>', 'The target host names', { choices: installed.hosts, required: true })
    .example(`
        node bin/sys-metrics/check --hosts dev-hermes-web1,dev-hermes-web2
        node bin/sys-metrics/check --hosts dev-hermes-*
        node bin/sys-metrics/check --hosts all
    `)
    .parse()

program.iterate('hosts', async (host) => {
    let ssh = await program.ssh(cfg.getHost(host).ip, 'root')
   
    await ssh.exec('cd /opt/dopamine/sys-metrics && git describe --tags')
    await ssh.exec('systemctl status sys-metrics | grep Active')
})

