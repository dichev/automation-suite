#!/usr/bin/env node
'use strict';

const Program = require('dopamine-toolbox').Program
const Shell = require('dopamine-toolbox').Shell
const MySQL = require('dopamine-toolbox').MySQL
const SSHClient = require('dopamine-toolbox').SSHClient
const cfg = require('configurator')
const fs = require('fs')
const os = require('os')
const isWin = os.platform() === 'win32'

const REPO = "d:/www/hermes/master"

let program = new Program({ chat: cfg.chat.rooms.deployBackend })

program
    .description(`Activate jackpot on operator`)
    .option('-o, --operator <string>', 'The target operator name', {required: true, choices: Object.keys(cfg.operators)})
    .option('--jackpotSeed <string>', 'The target jackpot seed (must be located in seed/next folder)', {required: true})
    .option('--platformSeed <string>', 'The target platform seed (must be located in seed/envs/next folder)', {required: true})
    .parse()


program.run(async () => {
    const operator = program.params.operator
    
    console.log(`Ensure the repos are up to date`)
    let shell = new Shell()
    await shell.exec(`cd ${REPO}/platform && git fetch --quiet --tags && git reset --hard origin/master`)
    await shell.exec(`cd ${REPO}/jackpot && git fetch --quiet --tags && git reset --hard origin/master`)
    
    const PLATFORM_SEED_FILE = `${REPO}/platform/.migrator/seed/envs/next/${program.params.platformSeed}.sql`
    const JACKPOT_SEED_FILE  = `${REPO}/jackpot/.migrator/seed/next/${program.params.jackpotSeed}.sql`
    
    if (!fs.existsSync(PLATFORM_SEED_FILE) || !fs.existsSync(JACKPOT_SEED_FILE)) {
        throw Error(`${PLATFORM_SEED_FILE} or ${JACKPOT_SEED_FILE} does not exist.`)
    }
    
    if (cfg.operators[operator].sharedJackpot) {
        throw Error(`Shared db ${cfg.operators[operator].sharedJackpot} is not yet supported.`)
    }
    
    let platformMigration = fs.readFileSync(PLATFORM_SEED_FILE).toString()
    let jackpotMigration  = fs.readFileSync(JACKPOT_SEED_FILE).toString()
    
    let dbs = cfg.databases[cfg.operators[operator].databases]
    
    let ssh = new SSHClient()
    await ssh.connect({
        host: dbs.master,
        username: 'root',
        agent: isWin ? 'pageant' : process.env.SSH_AUTH_SOCK,
        agentForward: true
    })
    
    let db = new MySQL()
    let db2 = new MySQL()
    await db.connect({user: 'root'}, ssh)
    await db2.connect({user: 'root'}, ssh)
    
    let dbNamePlatform = `${cfg.operators[operator].dbPrefix}platform`
    let dbNameJackpot  = `${cfg.operators[operator].dbPrefix}jackpot`
    
    await program.chat.message(`• Executing ${JACKPOT_SEED_FILE}`)
    await db.query(`USE ${dbNameJackpot};`)
    await db.query(jackpotMigration)
    
    await program.chat.message('_Please validate jackpot config is OK_')
    
    
    await program.confirm('Continue with platform migration?')
    await db.query(`USE ${dbNamePlatform}`)
    await db2.query(`USE ${dbNamePlatform}`)
    
    await program.chat.message('• Locking spins')
    await db.query('LOCK TABLE `currencies_exchange_rates` WRITE;')
    
    let spinsInProgress = await areThereSpinsInProgress(db2)
    let retries = 0
    
    while (spinsInProgress !== 0) {
        console.log(`There are ${spinsInProgress} spins in progress, sleeping for 1 sec`)
        
        await program.sleep(1)
        spinsInProgress = await areThereSpinsInProgress(db2)
        
        if (++retries > 30) throw new Error(`Failed to lock spins (there were rounds in progress for more than ${retries} sec)`)
    }
    
    await program.chat.message(`• Executing ${PLATFORM_SEED_FILE}`)
    await db2.query(platformMigration)
    
    await program.chat.message('• Unlocking spins')
    await db.query('UNLOCK TABLE;')
    
    await program.chat.message('Please validate\n * There is jackpot contribution\n * Jackpot panel(s) load\n * Jackpot feed works\n * Games are properly configured', {popup: true})
    
    await db.disconnect()
    await db2.disconnect()
    await ssh.disconnect()
})

async function areThereSpinsInProgress(db) {
    let res = await db.query('SELECT count(id) as spins FROM transactions_round_instance WHERE statusCode = 100')
    
    return parseInt(res[0].spins || 0)
}