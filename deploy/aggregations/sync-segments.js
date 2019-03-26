#!/usr/bin/env node
'use strict';

const Program = require('dopamine-toolbox').Program
const Shell = require('dopamine-toolbox').Shell
const SSHClient = require('dopamine-toolbox').SSHClient
const cfg = require('configurator')

const EXPORT_DIR = 'd:/www/analytics/aggregator-live/export'
const DEST_DIR = '/root/migrations/aggregations'

let program = new Program({ chat: cfg.chat.rooms.deployBackend })

program
    .description(`Sync segments data to aggregated data`)
    .option('-o, --operators <name>', 'The target operator name', { required: true, choices: Object.keys(cfg.operators) })
    .option('--mode <only-transfer|only-migrate|both>', 'Specify witch part of the deploy to be executed', { required: true, def: 'both', choices: ['only-transfer','only-migrate','both'] })


program.iterate('operators', async (operator) => {
    if(operator !== 'bots') throw Error('Not supported operator' + operator)
    
    const DO_TRANSFER = program.params.mode === 'both' || program.params.mode === 'only-transfer'
    const DO_MIGRATE  = program.params.mode === 'both' || program.params.mode === 'only-migrate'
    
    let today = new Date().toISOString().substr(0, 10)
    let fileName = `${operator}-${today}.sql`
    let dbs = cfg.databases[cfg.operators[operator].databases]
    let dbname = cfg.operators[operator].dbPrefix + 'segments'
    let ssh = await new SSHClient().connect({host: dbs.master, username: 'root'})
    
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
        await program.chat.message('Execute migration..')
        await ssh.exec(`mysql -u root ${dbname} < ${DEST_DIR}/${fileName}`)
    }
    
    console.log('Ready')
    await ssh.disconnect()
})
