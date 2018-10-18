#!/usr/bin/env node
'use strict';


const Program = require('dopamine-toolbox').Program
const Tester = require('dopamine-toolbox').Tester
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
            
            if(ssh.exists(`/etc/rsyslog.d/dope.conf`)){
                await ssh.exec(`mv /etc/rsyslog.d/dope.conf /tmp/rsyslog-dope.conf`)
            }
            
            switch (type) {
                case 'web':
                    await ssh.exec('ln -svf /opt/servers-conf/rsyslog/12-php.conf /etc/rsyslog.d/12-php.conf')
                    break
        
                case 'mysql':
                case 'mysql-archive':
                case 'mysql-slave':
                case 'mysql-master':
                    await ssh.exec('ln -svf /opt/servers-conf/rsyslog/10-mysql.conf /etc/rsyslog.d/10-mysql.conf')
                    break
        
                case 'lb':
                    await ssh.exec('ln -svf /opt/servers-conf/rsyslog/11-nginx.conf /etc/rsyslog.d/11-nginx.conf')
                    break
        
                default:
                    throw Error('Unexpected host type:' + type)
            }
    
            await ssh.exec('ln -svf /opt/servers-conf/rsyslog/common.conf /etc/rsyslog.d/common.conf')
        }
        
        let tester = new Tester()
        tester.it(`validate rsyslog configuration`, async () => await ssh.exec(`rsyslogd -N1`, {silent: true}))
        await tester.run()
    
        await program.confirm('Do you want to load the configurations')
        await ssh.exec('systemctl restart rsyslog')
        await ssh.exec('sleep 1 && systemctl status rsyslog')
        
        console.log('Success')
    })

