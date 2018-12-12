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

    let hostIP = cfg.getHost(host).ip;
    console.log(`Starting script on HOST:(${host} : ${hostIP})...`)
    await program.chat.notify(`Starting script on HOST:(${host} : ${hostIP})...`)

    console.log(host)
    let ssh = await program.ssh(cfg.getHost(host).ip, 'root')

    let mysqlHost = await ssh.exec(`cat /root/.my.cnf | grep host | cut -d'=' -f 2`)
    let mysqlHostParam = '';
    if (mysqlHost !== '') {
        mysqlHostParam = ` -H ${mysqlHost}`;
    }

    await program.chat.notify(`Starting full backup`)
    await ssh.exec(`/opt/pyxbackup/pyxbackup full ${mysqlHostParam} > /dev/null 2>&1`)
})