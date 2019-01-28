#!/usr/bin/env node
'use strict';


const Program = require('dopamine-toolbox').Program
const cfg = require('configurator')
let program = new Program({ chat: cfg.chat.rooms.devops })


program
    .description('Setup logrotate configurations')
    .option('-h, --hosts <list>', 'The target host names', { choices: Object.keys(cfg.hosts), required: true })
    .option('--only-validate', 'Perform just validation of the current logrotate configuration')
    
    .iterate('hosts', async (host) => {
        let ssh = await program.ssh(cfg.getHost(host).ip, 'root')
        const type = cfg.getHost(host).type
    
        if(!program.params.onlyValidate) {
            switch (type) {
                case 'web':
                    await ssh.exec('ln -svf /opt/servers-conf/logrotate/php-fpm /etc/logrotate.d/php-fpm && [ -f /etc/logrotate.d/php-fpm ]')
                    await ssh.exec('ln -svf /opt/servers-conf/logrotate/phperror /etc/logrotate.d/phperror && [ -f /etc/logrotate.d/phperror ]')
                    break
        
                case 'mysql':
                case 'mysql-archive':
                case 'mysql-slave':
                case 'mysql-master':
                    await ssh.exec('ln -svf /opt/servers-conf/logrotate/mysql /etc/logrotate.d/mysql && [ -f /etc/logrotate.d/mysql ]')
                    break
        
                case 'lb':
                case 'cdn':
                    await ssh.exec('ln -svf /opt/servers-conf/logrotate/nginx /etc/logrotate.d/nginx && [ -f /etc/logrotate.d/nginx ]')
                    break
        
                default:
                    throw Error('Unexpected host type:' + type)
            }
    
            await ssh.exec('ln -svf /opt/servers-conf/logrotate/rsyslog /etc/logrotate.d/rsyslog && [ -f /etc/logrotate.d/rsyslog ]')
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

