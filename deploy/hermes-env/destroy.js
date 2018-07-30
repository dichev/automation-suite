#!/usr/bin/env node
'use strict';

/**
 * Usage:
 * $ node deploy/hermes-env/destroy --env bots --location belgium -v
 */


const Program = require('dopamine-toolbox').Program
const cfg = require('configurator')

const log = console.log
const flatten = (arr) => arr.reduce((acc, val) => acc.concat(val), []);


// Configuration
const TEMPLATES = "d:/www/servers/template-generator" // TODO: temporary


let program = new Program({ chat: cfg.chat.rooms.devops })

program
    .option('-e, --env <name>', 'The target env name', { required: true })
    .option('-l, --location <name>', 'The target location', { required: true })

    .run(async () => {
        if(!cfg.operators[program.params.env]) throw Error(`missing configuration for this env ${program.params.env}`)
        if(cfg.operators[program.params.env].live !== false) throw Error(`This env ${program.params.env} is used already on live, so for security reasons the command is disabled for it`)
        
        const OPERATOR = program.params.env
        const SERVER = program.params.location
        const DEST = `/home/dopamine/production/${cfg.operators[OPERATOR].dir}`
        if(!/^[a-zA-Z0-9-_/]+$/g.test(DEST) || DEST.length <= '/home/dopamine/production/'.length) {
            throw Error(`The destination (${DEST}) is invalid and this could be VERY dangerous!`)
        }


        // Prepare and check ssh connections
        let hosts = cfg.locations[program.params.location].hosts
        let [web1, master, archive] = await Promise.all([
            program.ssh(hosts.web1, 'dopamine'),
            program.mysql({user: 'root', ssh: {user: 'root', host: hosts.mysql}}),
            program.mysql({user: 'root', ssh: {user: 'root', host: hosts.archive}}),
        ])


    
        // Check if env already exist
        log('Checking files on web1..')
        if(await web1.exists(DEST)){
            log(`DANGER! dopamine@${hosts.web1}:${DEST} exists!`)
            await program.confirm("Do you want to override it by removing it (yes)?")
            await program.confirm("Are you FUCKING sure (yes)?")
            log(`Removing ${DEST}`)
            await web1.exec(`rm -rf ${DEST}`) // TODO: may be do webs-sync
            log(`Done`)
            log(`\n\n===================================================\n\n`)
        }

        

    
        
        // Check databases & users
        let shell = await program.shell()
        log("Generating sql templates..")
        await shell.chdir(TEMPLATES)
        let SQL = {
            masterCheck:     await shell.exec(`bin/generator -t templates/sql/hermes-check.sql.hbs -o ${OPERATOR} -s ${SERVER} --print`, {silent: true}),
            masterRollback:  await shell.exec(`bin/generator -t templates/sql/hermes-rollback.sql.hbs -o ${OPERATOR} -s ${SERVER} --print`, {silent: true}),
            archiveCheck:    await shell.exec(`bin/generator -t templates/sql/hermes-check.sql.hbs -o ${OPERATOR} -s ${SERVER} --print`, {silent: true}),
            archiveRollback: await shell.exec(`bin/generator -t templates/sql/hermes-rollback-archive.sql.hbs -o ${OPERATOR} -s ${SERVER} --print`, {silent: true}),
        }
        
        log('Checking master database..')
        let dbMasterCheck = await master.query(SQL.masterCheck)
        if (flatten(dbMasterCheck).length) {
            log('WARNING! The databases/users in master already exist')
            log(SQL.masterRollback)
            await program.confirm('DANGER! Do you want to drop users/databases. To confirm please type "drop" here: ', 'no', ['drop'])
            await master.query(SQL.masterRollback)
        }

        log('Checking archive database..')
        let dbArchiveCheck = await archive.query(SQL.archiveCheck)
        if (flatten(dbArchiveCheck).length) {
            log('WARNING! The databases/users in archive already exist')
            log(SQL.archiveRollback)
            await program.confirm('DANGER! Do you want to drop users/databases. To confirm please type "drop" here: ', 'no', ['drop'])
            await archive.query(SQL.archiveRollback)
        }
    
    
    })

