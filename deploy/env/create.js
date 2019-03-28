#!/usr/bin/env node
'use strict';

/**
 * Usage:
 * $ node deploy/env/create --operator bots
 */


const Program = require('dopamine-toolbox').Program
const cfg = require('configurator')

const log = console.log
const fs = require('fs')
const read = (path) => fs.readFileSync(path).toString()


// Configuration
const TEMPLATES = __dirname.replace(/\\/g, '/') + '/output' // TODO: temporary
const ANOMALY = "d:/www/tools/anomaly/bin/check.js"

let program = new Program({ chat: cfg.chat.rooms.deployBackend })

program
    .option('-o, --operator <name>', 'The target operator name', { required: true, choices: Object.keys(cfg.operators) })

    .run(async () => {
        // Configuration
        const OPERATOR = program.params.operator
        const DEST = `/home/dopamine/production/${cfg.operators[OPERATOR].dir}`
        
        if (!cfg.operators[OPERATOR]) throw Error(`missing configuration for this env ${OPERATOR}`)
        if (!/^[a-zA-Z0-9-_/]+$/g.test(DEST) || DEST.length <= '/home/dopamine/production/'.length) {
            throw Error(`The destination (${DEST}) is invalid and this could be VERY dangerous!`)
        }
    
        const LOCATION = cfg.operators[OPERATOR].location
        
        
        // Preparations
        log(`Before the deploy you must prepare all configurations using:\n $ node deploy/env/prepare --operator ${OPERATOR} --location ${LOCATION}`)
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
        await program.chat.notify(`\nAdding code on webs`)
        await web1.exec(`git clone git@gitlab.dopamine.bg:releases/hermes.git ${DEST}`)

        await web1.exec(`chmod 777 ${DEST}/platform/logs ${DEST}/wallet/logs ${DEST}/gpanel/exports ${DEST}/gpanel/cache`)
        await shell.exec(`scp -r ${TEMPLATES}/${OPERATOR}/hermes/* dopamine@${hosts.web1}:${DEST}`)
        await web1.exec(`/home/dopamine/bin/webs-sync ${DEST}`)

        log("Setup chroot")
        let web1Root = await program.ssh(hosts.web1, 'root') // TODO: check why requires root
        await web1Root.exec(`/home/dopamine/bin/webs-chroot ${DEST}`)


        // Creating databases & users
        await program.chat.notify(`\nPreparing databases`)
        log('\nCreating master databases/users')
        await master.query(read(`${TEMPLATES}/${OPERATOR}/db/master.sql`))
        log('\nCreating archive databases/users')
        await archive.query(read(`${TEMPLATES}/${OPERATOR}/db/archive.sql`))


        // Seed databases
        log('Importing master schema..')
        await master.query(read(`${TEMPLATES}/${OPERATOR}/db/schema.sql`))
        log('Importing archive schema..')
        await archive.query(read(`${TEMPLATES}/${OPERATOR}/db/schema-archive.sql`))
        log('Importing master seed..')
        await master.query(read(`${TEMPLATES}/${OPERATOR}/db/seed.sql`))
        log('Importing operator specific seed..')
        await master.query(`USE ${cfg.operators[OPERATOR].dbPrefix}platform;`)
        await master.query(read(`${TEMPLATES}/${OPERATOR}/db/operator-seed.sql`))


        // Crons
        await program.chat.notify(`\nExecuting initial crons`)
        await web1.exec(`php ${DEST}/platform/bin/cmd.php exchange-rates`)
        await web1.exec(`php ${DEST}/platform/bin/cmd.php history-partitions`)
        await web1.exec(`php ${DEST}/platform/bin/cmd.php partition-tables`)

        await program.confirm('Are the cron results okay?')
        await shell.exec(`node servers/servers-conf/list-changes --locations ${LOCATION}`)

        // System configurations
        await program.chat.notify('\nUpdate system configurations (danger: could affect the other operators on failure)')
        log('This could affect the other envs if the setup is incorrect.')

        await program.confirm('DANGER! Are you sure you want to continue (yes)? ')
        await shell.exec(`node servers/servers-conf/update --locations ${LOCATION} --reload webs`)
        // TODO: rollback
    
        // Checkers & tests
        await program.chat.notify('\nChecking test suite')
        await shell.exec(`node deploy/env/check -o ${OPERATOR}`)
        
        // Update monitoring
        await program.chat.notify('\nUpdate monitoring configuration')
        await shell.exec(`node deploy/monitoring/update --force`)
    
        try {
            await shell.exec(`node ${ANOMALY} -s all -o ${OPERATOR}`)
        } catch (e) {
            throw Error(`There are failed test cases.\nPlease investigate.. \n`)
        }
    
        // TODO: clean ./output
    })