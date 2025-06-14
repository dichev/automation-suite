#!/usr/bin/env node
'use strict';

/**
 * Usage:
 * $ node deploy/env/destroy --operator bots -v
 */


const Program = require('dopamine-toolbox').Program
const cfg = require('configurator')
const fs = require('fs')

const log = console.log
const flatten = (arr) => arr.reduce((acc, val) => acc.concat(val), []);


// Configuration
const TEMPLATES = __dirname.replace(/\\/g, '/') + '/output' // TODO: temporary

let program = new Program({ chat: cfg.chat.rooms.deployBackend })

program
    .option('-o, --operator <name>', 'The target operator name', {required: true, choices: Object.keys(cfg.operators)})

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
            await web1.exec(`rm -rf ${DEST}`)
            await web1.exec(`mkdir ${DEST}`) // create empty dir
            await web1.exec(`/home/dopamine/bin/webs-sync --hard ${DEST}`) // sync empty dir, to delete /dev/random
            await web1.exec(`/home/dopamine/bin/webs-exec 'rm -d ${DEST}'`) // rm -d is equivelent to rmdir

            log(`Done`)
            log(`\n\n===================================================\n\n`)
        }

        

    
        
        // Check databases & users
        let shell = await program.shell()
        log("Generating sql templates..")
        await shell.chdir(TEMPLATES)
        let SQL = {
            masterCheck:     fs.readFileSync(`${TEMPLATES}/${OPERATOR}/db/check.sql`, 'utf8'),
            masterRollback:  fs.readFileSync(`${TEMPLATES}/${OPERATOR}/db/master-rollback.sql`, 'utf8'),
            archiveCheck:    fs.readFileSync(`${TEMPLATES}/${OPERATOR}/db/check.sql`, 'utf8'),
            archiveRollback: fs.readFileSync(`${TEMPLATES}/${OPERATOR}/db/archive-rollback.sql`, 'utf8'),
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



        let shell2 = await program.shell()
        await program.confirm(`Have you deleted the nginx & server configs from repo - ${LOCATION}?`)
        await shell2.exec(`node servers/servers-conf/list-changes --locations ${LOCATION}`)

        // System configurations
        await program.chat.notify('\nUpdate system configurations (danger: could affect the other operators on failure)')
        log('This could affect the other envs if the setup is incorrect.')

        await program.confirm('DANGER! Are you sure you want to continue (yes)? ')
        await shell2.exec(`node servers/servers-conf/update --locations ${LOCATION} --reload webs`)

        // Update monitoring
        await program.chat.notify('\nUpdate monitoring configuration')
        await shell2.exec(`node deploy/monitoring/update --force`)
        
        // Update anomaly
        await program.chat.notify('\nUpdate anomaly configuration')
        await shell2.exec(`node deploy/anomaly/rebuild`)
    
        // Restart safeguard to auto update its configuration
        await program.chat.notify('\nUpdate safeguard configuration')
        await shell2.exec(`node deploy/safeguard/control --mode restart -l ${LOCATION}`)
    
        log(`Destroyed successfully`)
    })

