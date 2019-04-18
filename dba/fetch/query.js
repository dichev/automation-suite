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
    .option('-q, --query <sql>', 'Read-only SQL query')
    .option('-o, --operators <name>', 'The target operator name', { required: true, choices: Object.keys(cfg.operators) })
    .option('--db <type>', 'The target database type', { choices: ['platform', 'demo', 'panel', 'bonus', 'segments', 'stats', 'jackpot', 'tournaments', 'archive'], def: 'platform' })
    .parse()


Promise.resolve().then(async () => {
    
    let query = ''
    if (program.params.query) {
        query = program.params.query
    } else {
        console.log(`Enter query for ${program.params.db} (use :dbname to asssign the database name)`)
        let input = new Input({collectHistoryFile: __dirname + '/.history'})
        query = await input.ask('>') || 'SELECT NOW();'
    }
    
    
    await program.iterate('operators', async (operator) => {
        let dbs = cfg.databases[cfg.operators[operator].databases]
        let ssh = new SSHClient()
        let isSharedJackpotDb = program.params.db === 'jackpot' && cfg.operators[operator].sharedJackpot

        await ssh.connect({
            host: program.params.db === 'archive' ? dbs.backups.archive : (isSharedJackpotDb ? dbs.backups.jackpots : dbs.backups.master),
            username: 'dopamine'
        })
        
        let ronly = cfg.access.mysql.readOnly
        let db = new MySQL()
        await db.connect({user: ronly.user, password: ronly.password}, ssh)
        let dbname = cfg.getOperatorDatabaseName(operator, program.params.db)
        
        await db.query(`USE ${dbname};`)
        let rows = await db.query(query.replace(/:dbname/g, dbname))
        let output = rows.length > 1 ? JSON.stringify(rows, null, 2) : JSON.stringify(rows)
        console.log(output)
        
        await db.disconnect()
        await ssh.disconnect()
    })
    
})