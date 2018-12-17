#!/usr/bin/env node
'use strict';

const Program = require('dopamine-toolbox').Program
const SSHClient = require('dopamine-toolbox').SSHClient
const cfg = require('configurator')
const DB_HOSTS = Object.keys(cfg.hosts).filter(h => h.includes('sql') || h.includes('-db-'))

let program = new Program({ chat: cfg.chat.rooms.devops, smartForce: true })
program
    .description('Upgrade percona mysql package to it\'s latest version')
    .option('-h, --hosts <list|all>', 'The target host name', {choices: DB_HOSTS, required: true})

    .iterate('hosts', async (host) => {
        let ssh = await new SSHClient().connect({host: cfg.getHost(host).ip, username: 'root'})
  
        const isSlave = ['mysql-slave','mysql-slave-archive'].includes(cfg.hosts[host].type)
        let answer = isSlave ? 'yes' : await program.ask(`DANGEROUS! Do you really want to restart ${cfg.hosts[host].type}`, ['yes', 'no'])
        if (answer === 'yes') {
            
            await program.chat.message('Stopping mysql..')
            console.log('Stopping mysql while watching the error log, press ctrl+c to end')
            ssh.exec(`tail -f /var/log/mysql/error.log`).catch(console.error);
            await ssh.exec(`/etc/init.d/mysql stop`)
            await program.sleep(5, 'waiting a bit just in case..')
    
            await program.chat.message('Upgrading percona package..')
            await ssh.exec(`apt-get -q update && apt-get -y --only-upgrade install percona-server-*`)
            await program.confirm('Continue?')
    
            await program.chat.message('Running mysql_upgrade..')
            await ssh.exec(`/etc/init.d/mysql start`) // in case there are no upgrades, the mysql will not start automatically
            await ssh.exec(`mysql_upgrade --force`)
            await program.confirm('Continue?')
    
            await program.chat.message('Restoring service file..') // the symlink is lost during apt-get upgrade
            await ssh.exec(`ln -svfT /opt/servers-conf-mysql/mysql.service /lib/systemd/system/mysql.service && [ -f /lib/systemd/system/mysql.service ]`);
            await ssh.exec(`systemctl daemon-reload`);
            await ssh.exec(`/etc/init.d/mysql restart`)
            await program.sleep(2)
        }

        console.log('Ready (press crtl+c to exit)')
        
        // await ssh.disconnect()
})

