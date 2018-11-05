#!/usr/bin/env node
'use strict';

const Program = require('dopamine-toolbox').Program
const SSHClient = require('dopamine-toolbox').SSHClient
const MySQL = require('dopamine-toolbox').MySQL
const cfg = require('configurator')
let program = new Program({ chat: cfg.chat.rooms.devops })

program
    .description('Optimize table fragmentation by rebuilding it online')
    .option('-o, --operators <name>', 'The target operator name', { required: true, choices: Object.keys(cfg.operators) })
    .option('-t, --tables <name>', 'The table names (comma separated)', { required: true })
    .option('--db <type>', 'The target database type', { required: true, choices: ['platform', 'panel', 'bonus', 'segments', 'stats', 'jackpot', 'tournaments'] })

    .iterate('operators', async (operator) => {
        if(program.params.wait === undefined) program.params.wait = 10
        
        let dbs = cfg.databases[cfg.operators[operator].databases]
    
        let ssh = await new SSHClient().connect({host: dbs.master, username: 'root'})
        let master = await new MySQL().connect({user: 'root' }, ssh)
        
        let dbname = cfg.operators[operator].dbPrefix + program.params.db
        let tables = program.params.tables.split(',')
        await master.query(`USE ${dbname};`)
    
        master.highLoadProtection({connections: 300})
        
        for(let table of tables) {
            await program.chat.message(`Optimizing ${table}`)
            await master.query('ALTER TABLE `' + table + '` FORCE')
        }
        await master.disconnect()
        await ssh.disconnect()
    })