#!/usr/bin/env node
'use strict';

/**
 * Usage:
 * $ node bin/hermes-env/destroy --env bots --location belgium -v
 */


const Deployer = require('deployer2')
const cfg = require('configurator')

const log = console.log
const fs = require('fs')
const flatten = (arr) => arr.reduce((acc, val) => acc.concat(val), []);


// Configuration
const TEMPLATES = "d:/www/servers/template-generator" // TODO: temporary


let deployer = new Deployer()

deployer
    .option('-e, --env <name>', 'The target env name')
    .option('-l, --location <name>', 'The target location')

    .run(async () => {
        if(deployer.params.location !== 'belgium') throw Error('this script is not ready for production!')
        if(!cfg.operators[deployer.params.env]) throw Error(`missing configuration for this env ${deployer.params.env}`)
        if(cfg.operators[deployer.params.env].live !== false) throw Error(`This env ${deployer.params.env} is used already on live, so for security reasons the command is disabled for it`)
        
        const OPERATOR = deployer.params.env
        const SERVER = deployer.params.location
        const DEST = `/home/dopamine/production/${cfg.operators[OPERATOR].dir}`
        if(!/^[a-zA-Z0-9-_/]+$/g.test(DEST) || DEST.length <= '/home/dopamine/production/'.length) {
            throw Error(`The destination (${DEST}) is invalid and this could be VERY dangerous!`)
        }


        // Prepare and check ssh connections
        let hosts = cfg.locations[deployer.params.location].hosts
        let [web1, master, archive] = await Promise.all([
            deployer.ssh(hosts.web1, 'dopamine'),
            deployer.mysql({user: 'root', ssh: {user: 'root', host: hosts.mysql}}),
            deployer.mysql({user: 'root', ssh: {user: 'root', host: hosts.archive}}),
        ])


    
        // Check if env already exist
        log('Checking files on web1..')
        if(await web1.exists(DEST)){
            log(`DANGER! dopamine@${hosts.web1}:${DEST} exists!`)
            await deployer.confirm("Do you want to override it by removing it (yes)?")
            await deployer.confirm("Are you FUCKING sure (yes)?")
            log(`Removing ${DEST}`)
            await web1.exec(`rm -rf ${DEST}`) // TODO: may be do webs-sync
            log(`Done`)
            log(`\n\n===================================================\n\n`)
        }


    
        
        // Check databases & users
        let shell = await deployer.shell()
        log("Generating sql templates..")
        await shell.chdir(TEMPLATES)
        let SQL = {
            masterCheck:     await shell.exec(`bin/generator -t templates/sql/hermes-rollback.sql.hbs -o ${OPERATOR} -s ${SERVER} --print`, {silent: true}),
            masterRollback:  await shell.exec(`bin/generator -t templates/sql/hermes-rollback.sql.hbs -o ${OPERATOR} -s ${SERVER} --print`, {silent: true}),
            archiveCheck:    await shell.exec(`bin/generator -t templates/sql/hermes-rollback-archive.sql.hbs -o ${OPERATOR} -s ${SERVER} --print`, {silent: true}),
            archiveRollback: await shell.exec(`bin/generator -t templates/sql/hermes-rollback-archive.sql.hbs -o ${OPERATOR} -s ${SERVER} --print`, {silent: true}),
        }
        
        log('Checking master database..')
        let dbMasterCheck = await master.query(SQL.masterCheck)
        if (flatten(dbMasterCheck).length) {
            log('WARNING! The databases/users in master already exist')
            await deployer.confirm('DANGER! Do you want to drop users/databases. To confirm please type "drop" here: ', 'no', ['drop'])
            log(SQL.masterRollback)
            await deployer.confirm('DANGER! The above commands will be executed, continue (yes)? ')
            await master.query(SQL.masterRollback)
        }
    
        log('Checking archive database..')
        let dbArchiveCheck = await archive.query(SQL.archiveCheck)
        if (flatten(dbArchiveCheck).length) {
            log('WARNING! The databases/users in archive already exist')
            await deployer.confirm('DANGER! Do you want to drop users/databases. To confirm please type "drop" here: ', 'no', ['drop'])
            log(SQL.archiveRollback)
            await deployer.confirm('DANGER! The above commands will be executed, continue (yes)? ')
            await archive.query(SQL.archiveRollback)
        }
    
    
    })

