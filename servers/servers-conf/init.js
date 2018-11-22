#!/usr/bin/env node
'use strict';

const Program = require('dopamine-toolbox').Program
const SSHClient = require('dopamine-toolbox').SSHClient
const cfg = require('configurator')

const LB_PATH = `
# Automation scripts:
PATH=$PATH:/bin
PATH=$PATH:/root/bin-root-lb/bin
export PATH
`


let program = new Program({ chat: cfg.chat.rooms.devops })
program
    .description('Setup unified server configurations')
    .option('-h, --hosts <list|all>', 'The target host name', {choices: Object.keys(cfg.hosts), required: true})

    .iterate('hosts', async (name) => {
        let host = cfg.getHost(name)
        let ssh = await new SSHClient().connect({host: host.ip, username: 'root'})
        
        
        if(host.type === 'lb'){
            await program.chat.message('Preparing nginx configurations..')
            await ssh.exec(`git clone git@gitlab.dopamine.bg:servers/servers-conf-${host.location}.git /opt/servers-conf`)
            await ssh.exec(`mv /etc/nginx /etc/nginx.org`);
            await ssh.exec(`ln -svf /opt/servers-conf/nginx /etc/nginx`)
            
            await ssh.exec(`git clone git@gitlab.dopamine.bg:sysadmin/bin-root-lb.git /root/bin-root-lb`)
            await ssh.exec(`echo "${LB_PATH}" >> /root/.bashrc`)

            await program.confirm('Do you want to restart nginx?')
            await ssh.exec(`/etc/init.d/nginx restart`)
            
        }
        else if(host.type === 'web' || host.type.startsWith('mysql')){
            await program.chat.message('Preparing servers-conf..')
            await ssh.exec(`git clone git@gitlab.dopamine.bg:servers/servers-conf-${host.location}.git /opt/servers-conf`)
            console.log(host.type === 'web' ? 'Do not forget to run php-binary/init' : 'Do not forget to run mysql-conf/setup')
            await program.confirm('Continue?')
        }
        else {
            throw Error('Unexpected host type:' + host.type)
        }
        
        
        await ssh.disconnect()
})

