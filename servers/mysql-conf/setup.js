#!/usr/bin/env node
'use strict';

const Program = require('dopamine-toolbox').Program
const SSHClient = require('dopamine-toolbox').SSHClient
const cfg = require('configurator')
const DB_HOSTS = Object.keys(cfg.hosts).filter(h => h.includes('sql') || h.includes('-db-'))

let program = new Program({ chat: cfg.chat.rooms.devops })
program
    .description('Setup unified mysql configuration')
    .option('-h, --hosts <list|all>', 'The target host name', {choices: DB_HOSTS, required: true})

    .iterate('hosts', async (host) => {
        let ssh = await new SSHClient().connect({host: cfg.getHost(host).ip, username: 'root'})
        
        
        await program.chat.message('Preparing symlinked configurations..')
        if(!await ssh.exists('/opt/servers-conf-mysql')) {
            await ssh.exec(`git clone git@gitlab.dopamine.bg:servers/servers-conf-mysql.git /opt/servers-conf-mysql`)
        }
        await ssh.exec(`mv /etc/mysql /etc/mysql.old-` + Date.now())
        await ssh.exec(`ln -svfT /opt/servers-conf-mysql/mysql.service /lib/systemd/system/mysql.service && [ -f /lib/systemd/system/mysql.service ]`);
        await ssh.exec(`ln -svfT /opt/servers-conf-mysql/mysql /etc/mysql && [ -d /etc/mysql ]`)
        await ssh.exec(`ln -svfT /opt/servers-conf-mysql/custom/${host}.cnf /etc/mysql/conf.d/mysqld_custom.cnf && [ -f /etc/mysql/conf.d/mysqld_custom.cnf ]`)
        

        
        await program.confirm('Restart mysql?')
        await program.chat.message('Restarting mysql..')
        
        console.log('Restarting mysql while watching the error log, press ctrl+c to end')
        ssh.exec(`tail -f /var/log/mysql/error.log`).catch(console.error)
        
        await ssh.exec(`systemctl daemon-reload`);
        await ssh.exec(`/etc/init.d/mysql restart`)
        
        // await ssh.disconnect()
})

