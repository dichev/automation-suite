#!/usr/bin/env node
'use strict';

const Program = require('dopamine-toolbox').Program
const cfg = require('configurator')
let program = new Program({ chat: cfg.chat.rooms.devops })

program
    .description('Optimize table fragmentation by rebuilding it online')
    .option('-o, --operators <name>', 'The target operator name', { required: true, choices: Object.keys(cfg.operators) })
    .option('-t, --tables <name>', 'The table names (comma separated)', { required: true })
    .option('--wait <int>', 'Pause between iterations in seconds (to reduce mysql load)', { def: 10 })
    .option('--db <type>', 'The target database type', { required: true, choices: ['platform', 'panel', 'bonus'], def: 'platform' })

    .iterate('operators', async (operator) => {
        
        let dbs = cfg.databases[cfg.operators[operator].databases]
        let master = await program.mysql({user: 'root', ssh: {user: 'root', host: dbs.master}})
        let DB = cfg.operators[operator].dbPrefix + program.params.db
        const TABLES = program.params.tables.split(',')
        await master.query(`USE ${DB};`)
    
        master.highLoadProtection({connections: 300})
        
        for(let table of TABLES) {
            await program.chat.notify(`Optimizing ${table}`)
            await master.query('ALTER TABLE `' + table + '` FORCE')
            await program.chat.notify(`Done.. waiting ${program.params.wait} secs`)
            await program.sleep(program.params.wait)
        }
    })