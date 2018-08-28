#!/usr/bin/env node
'use strict';


const Program = require('dopamine-toolbox').Program
const cfg = require('configurator')
let program = new Program({ chat: cfg.chat.rooms.devops })


program
    .description('Setup logrotate configurations')
    .option('-h, --hosts <list>', 'The target host names', { choices: Object.keys(cfg.hosts), required: true })
    
    .iterate('hosts', async (host) => {
        let ssh = await program.ssh(cfg.getHost(host).ip, 'root')
        const type = cfg.getHost(host).type
        
        switch (type){
            case 'web':
                await ssh.exec('ln -svf /opt/servers-conf/logrotate/php-fpm /etc/logrotate.d/php-fpm')
                await ssh.exec('ln -svf /opt/servers-conf/logrotate/phperror /etc/logrotate.d/phperror')
                await ssh.exec('ln -svf /opt/servers-conf/logrotate/rsyslog /etc/logrotate.d/rsyslog')
                break
    
            case 'mysql':
            case 'mysql-archive':
            case 'mysql-slave':
            case 'mysql-master':
                await ssh.exec('ln -svf /opt/servers-conf/logrotate/mysql /etc/logrotate.d/mysql')
                await ssh.exec('ln -svf /opt/servers-conf/logrotate/rsyslog /etc/logrotate.d/rsyslog')
                break
                
            case 'lb':
                await ssh.exec('ln -svf /opt/servers-conf/logrotate/nginx /etc/logrotate.d/nginx')
                await ssh.exec('ln -svf /opt/servers-conf/logrotate/rsyslog /etc/logrotate.d/rsyslog')
                break
            
            default:
                throw Error('Unexpected host type:' + type)
        }
        
        
        await program.chat.notify('Verifying all logrotate configurations')
        let tester = program.tester()
        let it = tester.it
        
        let configs = await ssh.exec('ls /etc/logrotate.d/ -1', {silent: true})
        for(let conf of configs.trim().split('\n')){
            it(`validate ${conf}`, async () => await ssh.exec(`logrotate -d /etc/logrotate.d/${conf}`, {silent: true}))
        }
        await tester.run()
    
        console.log('Success')
    })

