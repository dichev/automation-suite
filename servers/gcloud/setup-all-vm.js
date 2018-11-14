#!/usr/bin/env node
'use strict';

const Program = require('dopamine-toolbox').Program
const SSHClient = require('dopamine-toolbox').SSHClient
const Shell = require('dopamine-toolbox').Shell
const cfg = require('configurator')


let program = new Program({ chat: cfg.chat.rooms.devops })
program
    .description('Setup unified server configurations')
    .option('-l, --locations <list|all>', 'The target location name', {choices: Object.keys(cfg.locations), required: true})

    .iterate('hosts', async (name) => {
        let location = cfg.locations[name]
        let shell = new Shell()
        
        await program.chat.message('Setup servers-conf')
        await shell.exec(`node servers/servers-conf/init --no-chat -h ${location.name}-lb*`)
        await shell.exec(`node servers/servers-conf/init --no-chat -h ${location.name}-web*`)
        await shell.exec(`node servers/servers-conf/init --no-chat -h ${location.name}-db*`)
    
    
        await program.chat.message('Setup php-binary')
        await shell.exec(`node servers/php-binary/init --no-chat -h ${location.name}-web*`)
        
    
        await program.chat.message('Setup mysql configs')
        // TODO: tail -f here will block next execution:
        await shell.exec(`node servers/mysql-conf/setup --no-chat -h ${location.name}-db*`)
        
        
        await program.chat.message('Setup logrotate & rsyslog')
        await shell.exec(`node servers/vm-setup/logrotate -h --no-chat -h ${location.name}-*`)
        await shell.exec(`node servers/vm-setup/rsyslog -h --no-chat -h ${location.name}-*`)
})

