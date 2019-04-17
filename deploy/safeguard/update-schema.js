#!/usr/bin/env node
'use strict';

const Program = require('dopamine-toolbox').Program
const SSHClient = require('dopamine-toolbox').SSHClient
const MySQL = require('dopamine-toolbox').MySQL
const fs = require('fs')
const cfg = require('configurator')

const DEST = '/opt/dopamine/safeguard'

let program = new Program({chat: cfg.chat.rooms.devops})

program
    .description('Updating safeguard version')
    .option('-l, --locations <list|all>', 'The target location (will be used web1)', { choices: Object.keys(cfg.locations), required: true })
    .option('-m, --migration-path <name>', 'The path to migration sql file (like /d/www/_releases/migrations/safeguard-update.sql', { required: true })
    
    .iterate('locations', async (location) => {
        const sql = fs.readFileSync(program.params.migrationPath).toString()
        
        let dbs = cfg.databases[cfg.locations[location].hosts.databases[0]]
        let ssh = await new SSHClient().connect({username: 'root', host: dbs.master})
        let db = await new MySQL().connect({user: 'root'})
    
        console.log(`Running migration over ${location}..`)
        await db.query('USE `safeguard`')
        console.log(sql)
        await program.confirm('Confirm?')
        await db.query(sql)
        console.log(await db.query(`SHOW WARNINGS`))
        
  
        await db.disconnect()
        await ssh.disconnect()
    })

