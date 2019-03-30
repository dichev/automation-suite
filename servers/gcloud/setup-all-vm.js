#!/usr/bin/env node
'use strict';

const Program = require('dopamine-toolbox').Program
const SSHClient = require('dopamine-toolbox').SSHClient
const Shell = require('dopamine-toolbox').Shell
const cfg = require('configurator')


let program = new Program({ chat: cfg.chat.rooms.devops })
program
    .description('Setup unified server configurations')
    .option('-l, --location <name>', 'The target location name', {choices: Object.keys(cfg.locations), required: true})

    .run(async () => {
        let location = cfg.locations[program.params.location]
        let shell = new Shell()
        let verbose = program.params.verbose ? '--verbose' : ''

        
        // TODO: these must be added in the base images (see jira PRD-25)
        await program.chat.message('Fix hosts file and packages')
        let cmd = `sed -i 's/192.168.110./192.168.100./g' /etc/hosts && grep '192.168.100.' /etc/hosts || echo 'NOT FOUND VALID RECORDS'`
        await shell.exec(`node servers/executor/exec -h ${location.name}-* --exec "${cmd}"`)
        await shell.exec(`node servers/executor/exec -h ${location.name}-* --exec "apt-get -q update && apt-get -q install psmisc"`)
        // -------------------------------------------------


        await program.chat.message('Setup servers-conf')
        await shell.exec(`node servers/servers-conf/init --no-chat ${verbose} -h ${location.name}-lb*`)
        await shell.exec(`node servers/servers-conf/init --no-chat ${verbose} -h ${location.name}-web*`)
        await shell.exec(`node servers/servers-conf/init --no-chat ${verbose} -h ${location.name}-db*`)
    
        await program.chat.message('update conf repos')
        await shell.exec(`node servers/executor/exec -h ${location.name}-* --exec "cd /opt/servers-conf && git pull --no-rebase --ff-only --prune"`)
    
    
        await program.chat.message('Setup php-binary')
        await shell.exec(`node servers/php-binary/init --no-chat ${verbose} -h ${location.name}-web*`)


        await program.chat.message('Setup mysql configs')
        // TODO: tail -f here will block next execution:
        await shell.exec(`node servers/mysql-conf/setup --no-chat ${verbose} -h ${location.name}-db*`)

        
        await program.chat.message('Setup logrotate & rsyslog')
        await shell.exec(`node servers/vm-setup/logrotate --no-chat --force -h ${location.name}-*`)
        await shell.exec(`node servers/vm-setup/rsyslog   --no-chat --force -h ${location.name}-*`)

        
        await program.chat.message('install docker')
        await shell.exec(`node servers/docker/setup -h ${location.name}-lb*`)
        await shell.exec(`node servers/docker/setup -h ${location.name}-web*`)
        await shell.exec(`node deploy/cayetano/docker/init -l ${location.name}`)
        
        
        await program.chat.message('install monitoring exporters')
        await shell.exec(`node servers/monitoring/init-node-exporter  -h ${location.name}-*  -l live `)
        await shell.exec(`node servers/monitoring/init-mysql-exporter -h ${location.name}-db* -l live `)
        await shell.exec(`deploy/cayetano/docker/init -l ${location.name}`)
        
        
})

