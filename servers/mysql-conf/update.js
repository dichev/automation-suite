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
    .option('--reset', 'Reset manual changes')

    .iterate('hosts', async (host) => {
        let ssh = await new SSHClient().connect({host: cfg.getHost(host).ip, username: 'root'})
        await ssh.chdir('/opt/servers-conf-mysql')
    
        let changes = await ssh.exec(`git status --short --untracked-files=no`)
        if (changes) {
            await ssh.exec(`git diff`)
            if(program.params.reset) {
                await program.chat.message('Reset manual changes?')
                await ssh.exec('git reset --hard')
            } else {
                throw Error(`Aborting.. Manual changes found (use --reset to clean them)`)
            }
        }
        
        await program.chat.message('Fetching changes')
        await ssh.exec('git fetch --prune')
        await ssh.exec('git log HEAD..origin/master --oneline')
        await ssh.exec('git diff HEAD..origin/master --name-status')
    
        await program.confirm('Do you want to pull the changes?')
        await ssh.exec(`git pull --no-rebase --ff-only --prune`)
        
        let answer = await program.ask('DANGEROUS! Do you want to restart mysql', ['yes', 'no'])
        if(answer === 'yes') {
            await program.chat.message(' Restarting mysql..')
            console.log('Restarting mysql while watching the error log, press ctrl+c to end')
            ssh.exec(`tail -f /var/log/mysql/error.log`).catch(console.error);
            await ssh.exec(`/etc/init.d/mysql restart`)
        }
        
        console.log('Ready')
        
        // await ssh.disconnect()
})

