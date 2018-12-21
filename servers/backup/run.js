#!/usr/bin/env node
'use strict';

const Program = require('dopamine-toolbox').Program
const cfg = require('configurator')
let program = new Program({ chat: cfg.chat.rooms.devops })

let HOSTS = Object.keys(cfg.hosts).filter(h => h.includes('sofia-mysql') && (h.includes('archive') || h.includes('mirror')))

program
.description('Setup backups')
.option('-h, --hosts <list|all>', 'The target host names', { choices: HOSTS, required: true })
.option('-t, --type <list|all>', 'The target host names', { choices: ['full', 'incr'], required: true })

.iterate('hosts', async (host) => {
    const backupType  = program.params.type ;

    let hostIP = cfg.getHost(host).ip;
    console.log(`Starting script on HOST:(${host} : ${hostIP})...`)

    await program.chat.notify(`Starting full backup`)
    let ssh = await program.ssh(hostIP, 'root')
    await ssh.execBackground(`/opt/pyxbackup/pyxbackup ${backupType}`)
})