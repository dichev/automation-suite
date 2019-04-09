#!/usr/bin/env node
'use strict';

const Program = require('dopamine-toolbox').Program
const Shell = require('dopamine-toolbox').Shell
const SSHClient = require('dopamine-toolbox').SSHClient
const cfg = require('configurator')
const fs = require('fs')

const EXPORT_DIR = 'd:/www/analytics/aggregator-live/export'
const DEST_DIR = '/root/migrations/aggregations'

let program = new Program({ chat: cfg.chat.rooms.deployBackend, smartForce: true })

program
    .description(`Sync segments data to aggregated data`)
    .option('-o, --operators <name>', 'The target operator name', { required: true, choices: Object.keys(cfg.operators) })
    .option('--mode <only-transfer|only-migrate|both>', 'Specify witch part of the deploy to be executed', { required: true, def: 'both', choices: ['only-transfer','only-migrate','both'] })


console.warn('WARNING! Do not forget to ensure the segments aggregate cron is disabled AND is currently stopped!')

program.iterate('operators', async (operator) => {
    
    const DO_TRANSFER = program.params.mode === 'both' || program.params.mode === 'only-transfer'
    const DO_MIGRATE  = program.params.mode === 'both' || program.params.mode === 'only-migrate'
    
    let today = new Date().toISOString().substr(0, 10)
    let fileName = `${operator}-${today}.sql`
    
    if(!fs.existsSync(`${EXPORT_DIR}/${fileName}`)) {
        await program.chat.message(`WARNING! Skipping, no migration file found: ${fileName}`)
        return
    }
    
    let fileSize = (fs.statSync(`${EXPORT_DIR}/${fileName}`).size / 1024 / 1024).toFixed(2) + 'MB'
    let dbs = cfg.databases[cfg.operators[operator].databases]
    let dbname = cfg.operators[operator].dbPrefix + 'segments'
    let ssh = await new SSHClient().connect({host: dbs.master, username: 'root'})
    
    await program.chat.message(`Deploying over ${Object.values(cfg.hosts).find(h => h.ip === dbs.master ).name} migration ${fileName} (${fileSize})`)
    
    if(DO_TRANSFER) {
        await program.chat.message('Transferring migration..')
        console.log(`Transferring (with compression) ${EXPORT_DIR}/${fileName} to ${DEST_DIR}/${fileName}`)
        await ssh.exec(`mkdir -p ${DEST_DIR}`)
        let shell = new Shell()
        await shell.exec(`scp -C ${EXPORT_DIR}/${fileName} root@${dbs.master}:${DEST_DIR}/${fileName} > /dev/tty `)
        // await ssh.copyFile(`${DEST_DIR}/${fileName}`, `${EXPORT_DIR}/${fileName}`) // no compression here
    }
    
    if(DO_MIGRATE) {
        await program.confirm(`Execute migration over ${dbname}? `)
        
        // Protect from cronjob collision
        await program.chat.message('Prevent collision with cronjob "aggregate"..')
        await ssh.exec(`mysql ${dbname} -e "UPDATE _commands SET status = 'DISABLED' WHERE status = 'IDLE' AND command = 'aggregate'"`)
        let status = await ssh.exec(`mysql -sN ${dbname} -e "SELECT status FROM _commands WHERE command = 'aggregate'"`)
        if(status !== 'DISABLED') throw Error(`Aborting! The cron job 'aggregate' is currently working (status: ${status})!`)
    
        // Real migration:
        await program.chat.message('Execute migration..')
        await ssh.exec(`mysql ${dbname} < ${DEST_DIR}/${fileName}`)
    
        // Restore status of cronjob
        await ssh.exec(`mysql ${dbname} -e "UPDATE _commands SET status = 'IDLE' WHERE status = 'DISABLED' AND command = 'aggregate'"`)
    }
    
    await program.chat.message('Ready')
    await ssh.disconnect()
})
