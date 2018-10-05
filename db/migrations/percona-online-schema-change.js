#!/usr/bin/env node
'use strict';

const Program = require('dopamine-toolbox').Program
const cfg = require('configurator')
const fs = require('fs')
let program = new Program({ chat: cfg.chat.rooms.test })

const usage = `
    $  node db/migrations/percona-online-schema-change -o rtg --db platform --table __version --alter 'CHANGE COLUMN version version INT(10) UNSIGNED NOT NULL AFTER id' --dry-run
    $  node db/migrations/percona-online-schema-change -o rtg --db platform --table __version --alter-file single-alter-migration.sql
`

program
    .description(`Alters a table's structure without blocking reads or writes (will copy all rows)`)
    .option('-o, --operators <name>', 'The target operator name', { required: true, choices: Object.keys(cfg.operators) })
    .option('-t, --table <name>', 'The table name', { required: true })
    .option('--alter <sql>', 'The schema modification, without the ALTER TABLE keywords')
    .option('--alter-file <file>', 'File containing the schema modification, without the ALTER TABLE keywords')
    .option('--db <type>', 'The target database type', { required: true, choices: ['platform', 'panel', 'bonus'], def: 'platform' })
    .example(usage)
    .parse()
    
Promise.resolve().then(async() => {
  
    // SQL Alter parsing -----------
    if(!program.params.alter && !program.params.alterFile) throw Error('Missing one of --alter or --alter-file params')
    if(program.params.alter && program.params.alterFile) throw Error('You must pass just one of --alter and --alter-file params')
    let alter = program.params.alter || fs.readFileSync(program.params.alterFile).toString()
    if (alter.includes("'")) {
        console.log('Single quotes are not allowed due bash escaping issues and will be replaced with double quotes:')
        console.log(alter + '\n=>\n' + alter.replace(/'/g, '"'))
        await program.confirm('Continue?')
        alter = alter.replace(/'/g, '"')
    }
    
    
    await program.iterate('operators', async (operator) => {
        let dbs = cfg.databases[cfg.operators[operator].databases]
        let ssh = await program.ssh(dbs.master, 'root')
        
        let dbname = cfg.operators[operator].dbPrefix + program.params.db
        let table = program.params.table
        
        
        let cmd = `
            pt-online-schema-change D=${dbname},t=${table} \\
              --alter '${alter}' \\
              --statistics --progress time,10 --recursion-method none \\
              --chunk-time 10.00 --max-load Threads_running=300 --critical-load Threads_running=1000 \\
              ${program.params.dryRun ? '--dry-run' : '--execute'}
        `
        
        console.log(cmd)
        await program.confirm('Continue?')
        cmd = cmd.trim()
       
        const LOG_DIR = `/var/log/percona`
        const LOG_FILE = LOG_DIR + `/${operator}.log`
        await ssh.exec(`mkdir -p ${LOG_DIR}`, { allowInDryMode: true })
        
        await program.chat.notify(`Executing long running alter in background (see log here ${LOG_FILE})..`)
        await ssh.execBackground(cmd, {allowInDryMode: true, remoteLogFile: LOG_FILE})
        await program.chat.notify('Ready')
    })
    
})