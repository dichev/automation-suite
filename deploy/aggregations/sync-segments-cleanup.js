#!/usr/bin/env node
'use strict';

const Program = require('dopamine-toolbox').Program
const SSHClient = require('dopamine-toolbox').SSHClient
const cfg = require('configurator')

const DEST_DIR = '/root/migrations/aggregations'

let program = new Program({ chat: cfg.chat.rooms.deployBackend, smartForce: true })

program
    .description(`Clean migration files and tables after sync segments`)
    .option('-o, --operators <name>', 'The target operator name', { required: true, choices: Object.keys(cfg.operators) })


program.iterate('operators', async (operator) => {
    let today = new Date().toISOString().substr(0, 10)
    let dbs = cfg.databases[cfg.operators[operator].databases]
    let dbname = cfg.operators[operator].dbPrefix + 'segments'
    let ssh = await new SSHClient().connect({host: dbs.master, username: 'root'})

    
    await program.chat.message('Cleaning migration file..')
    await ssh.exec(`rm -fv ${DEST_DIR}/${operator}-*.sql`)

    
    await program.chat.message('Cleaning __archive segments tables..')
    let SQL = `
        DROP TABLE IF EXISTS __archive_user_games_summary_monthly;
        DROP TABLE IF EXISTS __archive_user_profile;
        DROP TABLE IF EXISTS __archive_user_summary;
        DROP TABLE IF EXISTS __archive_games_summary_daily;
        DROP TABLE IF EXISTS __archive_user_games_summary;
        DROP TABLE IF EXISTS __archive_user_games_summary_daily;
    `.replace(/\n/g , ' ')
    await ssh.exec(`mysql ${dbname} -e "${SQL}"`)

    await ssh.disconnect()
})
