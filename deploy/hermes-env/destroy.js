#!/usr/bin/env node
'use strict';

/**
 * Usage:
 * $ node deploy/hermes-env/destroy --operator bots -v
 */


const Program = require('dopamine-toolbox').Program
const cfg = require('configurator')
const fs = require('fs')

const log = console.log
const flatten = (arr) => arr.reduce((acc, val) => acc.concat(val), []);


// Configuration
const TEMPLATES = __dirname.replace(/\\/g, '/') + '/output' // TODO: temporary

let program = new Program({ chat: cfg.chat.rooms.devops })

program
    .option('-o, --operator <name>', 'The target operator name', {required: true})

    .run(async () => {
        if(!cfg.operators[program.params.operator]) throw Error(`missing configuration for this operator ${program.params.operator}`)
        if(cfg.operators[program.params.operator].live !== false) throw Error(`This operator ${program.params.operator} is used already on live, so for security reasons the command is disabled for it`)
        
        const OPERATOR = program.params.operator
        const LOCATION = cfg.operators[OPERATOR].location
        const DEST = `/home/dopamine/production/${cfg.operators[OPERATOR].dir}`
        if(!/^[a-zA-Z0-9-_/]+$/g.test(DEST) || DEST.length <= '/home/dopamine/production/'.length) {
            throw Error(`The destination (${DEST}) is invalid and this could be VERY dangerous!`)
        }


        // Prepare and check ssh connections
        let hosts = cfg.locations[LOCATION].hosts
        let dbs = cfg.databases[cfg.operators[OPERATOR].databases]
        let [web1, master, archive] = await Promise.all([
            program.ssh(hosts.web1, 'dopamine'),
            program.mysql({user: 'root', ssh: {user: 'root', host: dbs.master}}),
            program.mysql({user: 'root', ssh: {user: 'root', host: dbs.archive}}),
        ])


    
        // Check if operator already exist
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
            masterCheck:     fs.readFileSync(`${TEMPLATES}/${OPERATOR}/db/check.sql`),
            masterRollback:  fs.readFileSync(`${TEMPLATES}/${OPERATOR}/db/master-rollback.sql`),
            archiveCheck:    fs.readFileSync(`${TEMPLATES}/${OPERATOR}/db/check.sql`),
            archiveRollback: fs.readFileSync(`${TEMPLATES}/${OPERATOR}/db/archive-rollback-archive.sql`),
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
    
        log(`Destroyed successfully`)
    })

