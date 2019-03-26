#!/usr/bin/env node
'use strict';

// TODO: Temporary script - it should be combined with schema revision control

const Program = require('dopamine-toolbox').Program
const cfg = require('configurator')
const fs = require('fs')

const REPO = "d:/www/_releases/hermes/"

let program = new Program({ chat: cfg.chat.rooms.deployBackend, smartForce: true })
const DB_TYPES = ['platform', 'demo', 'panel', 'bonus', 'segments', 'stats', 'jackpot', 'tournaments', 'archive', 'reports', 'rewards'] 

program
    .description(`Auto execute SQL migrations to production`)
    .option('-o, --operators <name>', 'The target operator name', { required: true, choices: Object.keys(cfg.operators) })
    .option('-m, --migration-path <name>', 'The path to migration sql file (like /d/www/_releases/hermes/.migrations/r3.9.16.9/gpanel-r3.9.16.9.sql', { required: true })
    .option('--db <type>', 'The target database type', { required: true, choices: DB_TYPES})
    .parse()



Promise.resolve().then(async() => {
    const sql = fs.readFileSync(program.params.migrationPath).toString()
    
    await program.iterate('operators', async (operator) => {
        
        // if(['rtg', 'betconstruct'].includes(operator)) return program.chat.notify(`[${operator}] skipped`)
    
        
        let dbs = cfg.databases[cfg.operators[operator].databases]
        let db = await program.mysql({user: 'root', ssh: {user: 'root', host: program.params.db === 'archive' ? dbs.archive : dbs.master}})
        let dbname = cfg.operators[operator].dbPrefix + program.params.db
    
        if (program.params.db === 'jackpot' && cfg.operators[operator].sharedJackpot) {
            throw Error(`Shared db ${cfg.operators[operator].sharedJackpot} not yet supported because there is a risk to be executed twice`)
        }
        
        console.log(`Running migration over ${operator}..`)
        await db.query(`USE ${dbname};`)
        let sqlParsed = sql.replace(/{{operator\.dbPrefix}}/g, cfg.operators[operator].dbPrefix)
        console.log(sqlParsed)
        await program.confirm('Confirm?')
        await db.query(sqlParsed)
        console.log(await db.query(`SHOW WARNINGS`))

    })
})
