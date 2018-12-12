#!/usr/bin/env node
'use strict';

const Program = require('dopamine-toolbox').Program
const cfg = require('configurator')
let program = new Program({ chat: cfg.chat.rooms.devops })

let HOSTS = Object.keys(cfg.hosts).filter(h => h.includes('sofia-mysql') && (h.includes('archive') || h.includes('mirror')))

program
.description('Setup backups')
.option('-h, --hosts <list|all>', 'The target host names', { choices: HOSTS, required: true })
.option('-f, --force', 'Skip manual changes validations and proceed on your risk')
.iterate('hosts', async (host) => {
    const params = program.params
    const force  = params.force !== undefined;

    let hostIP = cfg.getHost(host).ip;
    console.log(`Starting script on HOST:(${host} : ${hostIP})...`)
    await program.chat.notify(`Starting script on HOST:(${host} : ${hostIP})...`)

    console.log(host)
    let ssh = await program.ssh(cfg.getHost(host).ip, 'root')

    await program.chat.notify(`Starting full backup`)
    await ssh.exec(`/opt/pyxbackup full > /dev/null 2>&1`)
})