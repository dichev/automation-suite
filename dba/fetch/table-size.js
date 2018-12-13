#!/usr/bin/env node
'use strict';

const Program = require('dopamine-toolbox').Program
const Input = require('dopamine-toolbox').Input
const SSHClient = require('dopamine-toolbox').SSHClient
const MySQL = require('dopamine-toolbox').MySQL
const cfg = require('configurator')
let program = new Program()

program
    .description('Fetch anything from operator database replications')
    .option('-t, --tables <list>', 'Comma separated list of tables', {required: true})
    .option('-o, --operators <name>', 'The target operator name', { required: true, choices: Object.keys(cfg.operators) })
    .option('--db <type>', 'The target database type', { choices: ['platform', 'panel', 'bonus', 'archive'], def: 'platform' })
    
    
    .iterate('operators', async (operator) => {
        let tables = program.params.tables.split(',')
        
        let dbs = cfg.databases[cfg.operators[operator].databases]
        let ssh = new SSHClient()
        await ssh.connect({ host: program.params.db === 'archive' ? dbs.backups.archive : dbs.backups.master, username: 'dopamine' })
        
        let ronly = cfg.access.mysql.readOnly
        let db = new MySQL()
        await db.connect({user: ronly.user, password: ronly.password}, ssh)
        let dbname = cfg.operators[operator].dbPrefix + program.params.db
        
        
        const SQL = `
            SELECT
                table_name as 'table',
                CONCAT(round(((data_length + index_length) / 1024 / 1024), 2), ' MB') as size,
                CONCAT(round(((data_free) / 1024 / 1024), 2), ' MB') as free,
                table_rows as rows
            FROM information_schema.TABLES
            WHERE table_schema = '${dbname}'
              AND (table_name LIKE '${tables.join("' OR table_name LIKE '")}')
        `
        
        
        let rows = await db.query(SQL)
        rows.forEach(row => console.log(`${row.table}: ` + `${row.size}`.padEnd(12) + `(free ` + `${row.free},`.padEnd(12) + ` ${row.rows} rows)`))
        // console.log(JSON.stringify(rows, null, 2))
        
        await db.disconnect()
        await ssh.disconnect()
    })
    
