#!/usr/bin/env node
'use strict';

const Program = require('dopamine-toolbox').Program
const SSHClient = require('dopamine-toolbox').SSHClient
const cfg = require('configurator')
const DB_HOSTS = Object.keys(cfg.hosts).filter(h => h.includes('sql') || h.includes('-db-'))

let program = new Program({ chat: cfg.chat.rooms.devops, smartForce: true })
program
    .description('Setup unified mysql configuration')
    .option('-h, --hosts <list|all>', 'The target host name', {choices: DB_HOSTS, required: true})
    .option('--mode <restart|fetch>', 'Restart mysql server or just fetch the changes (will be applied on next restart)', {choices: ['restart', 'fetch']})
    .option('--query <sql>', 'Execute SQL command after the update (to apply global setting change without restart), for example: "SET GLOBAL expire_logs_days = 5"')
    .option('--reset', 'Reset manual changes')

    .iterate('hosts', async (host) => {
        let ssh = await new SSHClient().connect({host: cfg.getHost(host).ip, username: 'root'})
        await ssh.chdir('/opt/servers-conf-mysql')
    
        let changes = await ssh.exec(`git status --short --untracked-files=no`)
        if (changes) {
            await ssh.exec(`git diff`)
            if(program.params.reset) {
                await program.confirm('Reset manual changes?')
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
    
        if(program.params.mode === 'restart') {
            const isSlave = ['mysql-slave','mysql-slave-archive'].includes(cfg.hosts[host].type)
            let answer = isSlave ? 'yes' : await program.ask(`DANGEROUS! Do you really want to restart ${cfg.hosts[host].type}`, ['yes', 'no'])
            if (answer === 'yes') {
                await program.chat.message(' Restarting mysql..')
                console.log('Restarting mysql while watching the error log, press ctrl+c to end')
                ssh.exec(`tail -f /var/log/mysql/error.log`).catch(console.error);
                await ssh.exec(`systemctl daemon-reload`);
                await ssh.exec(`/etc/init.d/mysql restart`)
                await program.sleep(5)
            }
        }
        else {
            console.warn(`WARNING! The changes will be applied on next restart. You should set them now using SET GLOBAL`)
        }
        
        if(program.params.query){
            let cmd = `mysql -uroot -e "${program.params.query.replace(/"/g, "'")}"`
            console.log('\n>',cmd)
            await program.confirm('Execute?')
            await ssh.exec(cmd)
        }
        
        console.log('Ready (press crtl+c to exit)')
        
        // await ssh.disconnect()
})

