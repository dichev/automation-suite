#!/usr/bin/env node
'use strict';


const Program = require('dopamine-toolbox').Program
const Tester = require('dopamine-toolbox').Tester
const cfg = require('configurator')
let program = new Program({ chat: cfg.chat.rooms.devops, smartForce: true })
let tester = new Tester()


program
    .description('Setup logrotate configurations')
    .option('-h, --hosts <list>', 'The target host names', { choices: Object.keys(cfg.hosts), required: true })
    .option('--only-validate', 'Perform just validation of the current logrotate configuration')
    
    .iterate('hosts', async (host) => {
        let ssh = await program.ssh(cfg.getHost(host).ip, 'root')
        const type = cfg.getHost(host).type
    
        let it = tester.it
        it(`php config exists`, async () => await ssh.exists(`/opt/servers-conf/rsyslog/12-php.conf`))
        it(`mysql config exists`, async () => await ssh.exists(`/opt/servers-conf/rsyslog/10-mysql.conf`))
        it(`nginx config exists`, async () => await ssh.exists(`/opt/servers-conf/rsyslog/11-nginx.conf`))
        it(`common config exists`, async () => await ssh.exists(`/opt/servers-conf/rsyslog/common.conf`))
        await tester.run(true)
        
        if(program.params.onlyValidate) return
    
        if (await ssh.exists(`/etc/rsyslog.d/dope.conf`)) {
            console.log('removing deprecated dope.conf')
            await ssh.exec(`mv /etc/rsyslog.d/dope.conf /tmp/rsyslog-dope.conf`)
        }
        
        switch (type) {
            case 'web':
                await ssh.exec('ln -svf /opt/servers-conf/rsyslog/12-php.conf /etc/rsyslog.d/12-php.conf && [ -f /etc/rsyslog.d/12-php.conf ]')
                break
    
            case 'mysql':
            case 'mysql-archive':
            case 'mysql-slave':
            case 'mysql-master':
                await ssh.exec('ln -svf /opt/servers-conf/rsyslog/10-mysql.conf /etc/rsyslog.d/10-mysql.conf && [ -f /etc/rsyslog.d/10-mysql.conf ]')
                break
    
            case 'lb':
            case 'cdn':
                await ssh.exec('ln -svf /opt/servers-conf/rsyslog/11-nginx.conf /etc/rsyslog.d/11-nginx.conf && [ -f /etc/rsyslog.d/11-nginx.conf ]')
                break
    
            default:
                throw Error('Unexpected host type:' + type)
        }

        await ssh.exec('ln -svf /opt/servers-conf/rsyslog/common.conf /etc/rsyslog.d/common.conf && [ -f /etc/rsyslog.d/common.conf ]')
      
        it(`validate rsyslog configuration`, async () => await ssh.exec(`rsyslogd -N1`, {silent: true}))
        await tester.run(true)
    
        await program.confirm('Do you want to load the configurations?')
        await ssh.exec('systemctl restart rsyslog')
        await ssh.exec('sleep 1 && systemctl status rsyslog | head -n 3')
        
        console.log('Success')
    })

