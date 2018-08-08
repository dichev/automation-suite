#!/usr/bin/env node
'use strict';

// TODO: protect from wrong revision update
// TODO: cleanup output and throw: of $ auditor --task ExtractGames -o ${operator}

const Program = require('dopamine-toolbox').Program
const cfg = require('configurator')
const fs = require('fs')

const REPO = "d:/www/hermes/master/platform"

let program = new Program({ chat: cfg.chat.rooms.devops })

program
    .description(`Sync games and maths seeds`)
    .option('-o, --operators <name>', 'The target operator name', { required: true, choices: Object.keys(cfg.operators) })
    .option('-r, --rev <name>', 'The target revision or tag name (like games-10) from platform project', { required: true })
    .parse()



Promise.resolve().then(async() => {
    const REV = program.params.rev
    console.log(`Ensure the migration is at the expected revision: ${REV}`)
    await program.shell().exec(`cd ${REPO} && git fetch --quiet --tags && git reset --hard ${REV}`)
    const seed = fs.readFileSync(`${REPO}/.migrator/seed/games/games-certified.sql`).toString()
    
    await program.confirm(`\nAre you sure you want to sync production games to this revision?`)
    
    await program.iterate('operators', async (operator) => {
        let dbs = cfg.databases[cfg.operators[operator].databases]
        let master = await program.mysql({user: 'root', ssh: {user: 'root', host: dbs.master}})
        let dbname = cfg.operators[operator].dbPrefix + 'platform'
        
        console.log(`Syncing games seed of ${operator}..`)
        await master.query(`USE ${dbname};`)
        await master.query(seed)

    })
})
