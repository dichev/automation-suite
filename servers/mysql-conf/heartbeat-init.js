#!/usr/bin/env node
'use strict';

const Program = require('dopamine-toolbox').Program
const SSHClient = require('dopamine-toolbox').SSHClient
const cfg = require('configurator')

const DB_HOSTS = Object.keys(cfg.hosts).filter(h => h.includes('sql') || h.includes('-db-'))

let program = new Program({ chat: cfg.chat.rooms.devops })
program
.description('Setup test heartbeat db')
.option('-h, --hosts <list|all>', 'The target host name', {choices: DB_HOSTS, required: true})

.iterate('hosts', async (name) => {
    let host = cfg.getHost(name)
    let ssh = await new SSHClient().connect({host: host.ip, username: 'root'})

    let master = await program.mysql({user: 'root', ssh: {user: 'root', host: host.ip}})

    await program.chat.message('Starting heartbeat initiation...')

    // create db test
    await master.query("CREATE DATABASE test;")
    await master.query(`USE test; CREATE TABLE heartbeat (
                            ts                    varchar(26) NOT NULL,
                            server_id             int unsigned NOT NULL PRIMARY KEY,
                            file                  varchar(255) DEFAULT NULL,    
                            position              bigint unsigned DEFAULT NULL, 
                            relay_master_log_file varchar(255) DEFAULT NULL,    
                            exec_master_log_pos   bigint unsigned DEFAULT NULL  
                        );
    `)

    await ssh.exec('systemctl enable /opt/servers-conf-mysql/pt-heartbeat.service')
    await ssh.exec('systemctl restart pt-heartbeat.service')
    await program.sleep(2, 'Waiting a bit just in case');
    await ssh.exec('systemctl status pt-heartbeat.service')

    await ssh.disconnect()

    await program.chat.notify('Success')
})