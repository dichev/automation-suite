#!/usr/bin/env node
'use strict';

// TODO: protect from wrong revision update

const Program = require('dopamine-toolbox').Program
const cfg = require('configurator')
const fs = require('fs')

const REPO = "d:/www/_releases/hermes.seed"

let program = new Program({ chat: cfg.chat.rooms.test })

program
    .description(`Sync operator bet limits without betlimits downtime`)
    .option('-o, --operators <name>', 'The target operator name', { required: true, choices: Object.keys(cfg.operators) })
    .option('--rollback', 'Will restore the previous state of the bet limits. In case of production errors this is the fastest route')
    .parse()


Promise.resolve().then(async() => {
    console.log(`Ensure the repo is up to date`)
    await program.shell().exec(`cd ${REPO} && git fetch --quiet --tags && git reset --hard origin/master`)
    
    await program.iterate('operators', async (operator) => {
        
        let dbs = cfg.databases[cfg.operators[operator].databases]
        let master = await program.mysql({user: 'root', ssh: {user: 'root', host: dbs.master}})
        let dbname = cfg.operators[operator].dbPrefix + 'platform'
        await master.query(`USE ${dbname};`)
    
    
        // rollback in case of emergency
        if (program.params.rollback) {
            await program.confirm('Are you sure you want to revert the previous state of the bet limits? ')
            await program.chat.notify('Reverting betlimits (using data in __sync_users_bet_limits_default_prev table)')
            await master.query(`
                RENAME TABLE users_bet_limits_default TO __sync_users_bet_limits_default_next, __sync_users_bet_limits_default_prev TO users_bet_limits_default;
            `)
            return
        }
        
        
        // prepare
        console.log('Preparing the new betlimits in separate table (safer)')
        const seed = fs.readFileSync(`${REPO}/betlimits/${operator}.sql`).toString()
        await master.query(`
            DROP TABLE IF EXISTS __sync_users_bet_limits_default_next;
            CREATE TABLE __sync_users_bet_limits_default_next LIKE users_bet_limits_default;
        `)
        await master.query(seed.replace(/users_bet_limits_default/g, '__sync_users_bet_limits_default_next'))
        
        
        
        // validate
        let [row] = await master.query(`SELECT COUNT(*) as total FROM __sync_users_bet_limits_default_next`)
        if(parseInt(row.total) <= 0) throw Error('There are no records in the new betlimits table. Please check __sync_users_bet_limits_default_next table. \nAborting for investigation..')
        console.log(`Found ${row.total} bet limits records`)
        
        
        // execute
        await program.confirm('Do you want to activate the new betlimits?')
        await master.query(`
            DROP TABLE IF EXISTS __sync_users_bet_limits_default_prev;
            RENAME TABLE users_bet_limits_default TO __sync_users_bet_limits_default_prev, __sync_users_bet_limits_default_next TO users_bet_limits_default;
        `)

    })
})
