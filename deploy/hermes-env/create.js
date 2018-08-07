#!/usr/bin/env node
'use strict';

/**
 * Usage:
 * $ node deploy/hermes-env/create --env bots
 */


const Program = require('dopamine-toolbox').Program
const cfg = require('configurator')

const log = console.log
const fs = require('fs')
const read = (path) => fs.readFileSync(path).toString()


// Configuration
const TEMPLATES = "d:/www/servers/template-generator" // TODO: temporary


let program = new Program({ chat: cfg.chat.rooms.devops })

program
    .option('-e, --env <name>', 'The target env name', { required: true })

    .run(async () => {
        // Configuration
        const OPERATOR = program.params.env
        const DEST = `/home/dopamine/production/${cfg.operators[OPERATOR].dir}`
        
        if (!cfg.operators[OPERATOR]) throw Error(`missing configuration for this env ${OPERATOR}`)
        if (cfg.operators[OPERATOR].live !== false) throw Error(`This env ${OPERATOR} is used already on live, so for security reasons the command is disabled for it`)
        if (!/^[a-zA-Z0-9-_/]+$/g.test(DEST) || DEST.length <= '/home/dopamine/production/'.length) {
            throw Error(`The destination (${DEST}) is invalid and this could be VERY dangerous!`)
        }
    
        const LOCATION = cfg.operators[OPERATOR].location
        
        
        // Preparations
        log(`Before the deploy you must prepare all configurations using:\n $ node deploy/hermes-env/prepare --env ${OPERATOR} --location ${LOCATION}`)
        await program.confirm('Have you prepared them (yes)? ')
        // TODO check if they exists



    
        // Prepare and check ssh connections
        let hosts = cfg.locations[LOCATION].hosts
        let dbs = cfg.databases[cfg.operators[OPERATOR].databases]
        let [web1, master, archive] = await Promise.all([
            program.ssh(hosts.web1, 'dopamine'),
            program.mysql({user: 'root', ssh: {user: 'root', host: dbs.master}}),
            program.mysql({user: 'root', ssh: {user: 'root', host: dbs.archive}}),
        ])
        let shell = program.shell()
    


        // Creating the environment
        log("Adding code on webs..")
        await web1.exec(`git clone git@gitlab.dopamine.bg:releases/hermes.git ${DEST}`)

        await web1.exec(`chmod 777 ${DEST}/wallet/logs && chmod 777 ${DEST}/gpanel/exports`)
        await shell.exec(`scp -r ${TEMPLATES}/output/${OPERATOR}/hermes/* dopamine@${hosts.web1}:${DEST}`)
        await web1.exec(`/home/dopamine/bin/webs-sync ${DEST}`)

        log("Setup chroot")
        let web1Root = await program.ssh(hosts.web1, 'root') // TODO: check why requires root
        await web1Root.exec(`/home/dopamine/bin/webs-chroot ${DEST}`)


        // Creating databases & users
        log('\nCreating master databases/users')
        await master.query(read(`${TEMPLATES}/output/${OPERATOR}/db/master.sql`))
        log('\nCreating archive databases/users')
        await archive.query(read(`${TEMPLATES}/output/${OPERATOR}/db/archive.sql`))


        // Seed databases
        log('Importing master schema..')
        await master.query(read(`${TEMPLATES}/output/${OPERATOR}/db/schema.sql`))
        log('Importing archive schema..')
        await archive.query(read(`${TEMPLATES}/output/${OPERATOR}/db/schema-archive.sql`))
        log('Importing master seed..')
        await master.query(read(`${TEMPLATES}/output/${OPERATOR}/db/seed.sql`))

    
        // Crons
        log(`\nExecuting initial crons`)
        await web1.exec(`php ${DEST}/platform/bin/cmd.php exchange-rates`)
    
        // System configurations
        log('\nUpdate system configurations')
        log('This could affect the other envs if the setup is incorrect.')
        await program.confirm('DANGER! Are you sure you want to continue (yes)? ')
        await shell.exec(`node servers/servers-conf/update --locations ${LOCATION}`)
    
        // Checkers & tests
        await shell.exec(`node deploy/hermes-env/check --env ${OPERATOR} --location ${LOCATION}`)
        
        console.warn(`Manual steps: \ - Add cron tab configuration`) // TODO: automate
    })