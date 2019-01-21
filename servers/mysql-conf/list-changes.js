#!/usr/bin/env node
'use strict';

const Program = require('dopamine-toolbox').Program
const SSHClient = require('dopamine-toolbox').SSHClient
const cfg = require('configurator')
const DB_HOSTS = Object.keys(cfg.hosts).filter(h => h.includes('sql') || h.includes('-db-'))

let program = new Program()
program
    .description('Check for not applied changes in mysql server repo')
    .option('-h, --hosts <list|all>', 'The target host name', {choices: DB_HOSTS, required: true})

    .iterate('hosts', async (host) => {
        let ssh = await new SSHClient().connect({host: cfg.getHost(host).ip, username: 'root'})
        await ssh.chdir('/opt/servers-conf-mysql')
        
        await ssh.exec('git fetch origin master --quiet')
        await ssh.exec('git log HEAD..origin/master --oneline')
        
        await ssh.disconnect()
})

