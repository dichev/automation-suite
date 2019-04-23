#!/usr/bin/env node
'use strict';

const Program = require('dopamine-toolbox').Program
const Shell = require('dopamine-toolbox').Shell
const MySQL = require('dopamine-toolbox').MySQL
const SSHClient = require('dopamine-toolbox').SSHClient
const cfg = require('configurator')
const fs = require('fs')

const REPO = "d:/www/hermes/master"

let program = new Program({ chat: cfg.chat.rooms.deployBackend })

program
    .description(`Execute jackpot related migrations with spin locking`)
    .option('-o, --operator <string>', 'The target operator name', {required: true, choices: Object.keys(cfg.operators)})
    .option('--jackpotSeed <string>', 'The target jackpot seed (must be located in seed/next folder)', {required: false})
    .option('--platformSeed <string>', 'The target platform seed (must be located in seed/envs/next folder)', {required: false})
    .example(`
        node deploy/hermes/jackpot.js -o mansion --jackpotSeed mansionPop
        node deploy/hermes/jackpot.js -o mansion --platformSeed mansion-jackpot
        node deploy/hermes/jackpot.js -o mansion --jackpotSeed mansionPop --platformSeed mansion-jackpot
    `)
    .parse()


program.run(async () => {
    if (!program.params.platformSeed && !program.params.jackpotSeed) throw Error('You must provide at least one migration.')
    
    const areThereSpinsInProgress = async function(db) {
        let res = await db.query('SELECT count(id) as spins FROM transactions_round_instance WHERE statusCode = 100')
        
        return parseInt(res[0].spins || 0)
    }
    
    const operator = program.params.operator
    const DB_NAME_PLATFORM = `${cfg.operators[operator].dbPrefix}platform`
    const DB_NAME_JACKPOT  = `${cfg.operators[operator].dbPrefix}jackpot`
    
    console.log(`Ensure the repos are up to date`)
    let shell = new Shell()
    await shell.exec(`cd ${REPO}/platform && git fetch --quiet --tags && git reset --hard origin/master`)
    await shell.exec(`cd ${REPO}/jackpot && git fetch --quiet --tags && git reset --hard origin/master`)
    
    let platformMigration  = null
    let jackpotMigration   = null
    
    let PLATFORM_SEED_FILE = null
    let JACKPOT_SEED_FILE  = null
    
    
    if (program.params.platformSeed) {
        PLATFORM_SEED_FILE = `${REPO}/platform/.migrator/seed/envs/next/${program.params.platformSeed}.sql`
        platformMigration  = fs.readFileSync(PLATFORM_SEED_FILE).toString()
    }
    
    if (program.params.jackpotSeed) {
        if (cfg.operators[operator].sharedJackpot) {
            throw Error(`Shared db ${cfg.operators[operator].sharedJackpot} is not yet supported.`)
        }
    
        JACKPOT_SEED_FILE = `${REPO}/jackpot/.migrator/seed/next/${program.params.jackpotSeed}.sql`
        jackpotMigration  = fs.readFileSync(JACKPOT_SEED_FILE).toString()
    }
    
    let dbs = cfg.databases[cfg.operators[operator].databases]
    
    let ssh = new SSHClient()
    await ssh.connect({
        host: dbs.master,
        username: 'root',
    })
    
    let db = new MySQL()
    let db2 = new MySQL()
    await db.connect({user: 'root'}, ssh)
    await db2.connect({user: 'root'}, ssh)
    
    await program.confirm('Do you want to begin?')
    
    await db.query(`USE ${DB_NAME_PLATFORM}`)
    
    await program.chat.message('• Locking spins')
    await db.query('LOCK TABLE `currencies_exchange_rates` WRITE;')
    
    await db2.query(`USE ${DB_NAME_PLATFORM}`)
    
    let spinsInProgress
    let retries = 0
    
    do {
        spinsInProgress = await areThereSpinsInProgress(db2)
        
        console.log(`There are ${spinsInProgress} spins in progress, sleeping for 1 sec`)
        await program.sleep(1)
    
        if (++retries > 30) throw new Error(`Failed to lock spins (there were rounds in progress for more than ${retries} sec)`)
    } while (spinsInProgress !== 0)
    
    if (jackpotMigration) {
        await db2.query(`USE ${DB_NAME_JACKPOT}`)
    
        await program.chat.message(`• Executing ${JACKPOT_SEED_FILE}`)
        await db2.query(jackpotMigration)
    }
    
    if (platformMigration) {
        await db2.query(`USE ${DB_NAME_PLATFORM}`)
    
        await program.chat.message(`• Executing ${PLATFORM_SEED_FILE}`)
        await db2.query(platformMigration)
    }
    
    await program.chat.message('• Unlocking spins')
    await db.query('UNLOCK TABLE;')
    
    await program.chat.message('Please validate\n * There is jackpot contribution\n * Jackpot panel(s) load\n * Jackpot feed works\n * Games are properly configured', {popup: true})
    
    await db.disconnect()
    await db2.disconnect()
    await ssh.disconnect()
})
