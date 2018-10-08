#!/usr/bin/env node
'use strict';

const Program = require('dopamine-toolbox').Program
const cfg = require('configurator')
const fs = require('fs')
let program = new Program()

program
    .description('Optimize table fragmentation by rebuilding it online')
    .option('-q, --query <sql>', 'Read-only SQL query', { required: true }) // TODO as arg param?
    .option('-o, --operators <name>', 'The target operator name', { required: true, choices: Object.keys(cfg.operators) })
    .option('--db <type>', 'The target database type', { choices: ['platform', 'panel', 'bonus', 'archive'], def: 'platform' })

    .iterate('operators', async (operator) => {
        let dbs = cfg.databases[cfg.operators[operator].databases]
        let ssh = await program.ssh(program.params.db === 'archive' ? dbs.backups.archive : dbs.backups.master, 'dopamine')
    
        let ronly = cfg.access.mysql.readOnly
        let db = await program.mysql({user: ronly.user, password: ronly.password, ssh})
        let dbname = cfg.operators[operator].dbPrefix + program.params.db
        
        await db.query(`USE ${dbname};`)
        let rows = await db.query(program.params.query)
        console.log(JSON.stringify(rows, null, 2))
    })