#!/usr/bin/env node
'use strict';

/**
 * Usage:
 * $ node bin/hermes-env/create --env bots --location belgium
 */


const Deployer = require('deployer2')
const cfg = require('configurator')

const log = console.log
const fs = require('fs')
const read = (path) => fs.readFileSync(path).toString()


// Configuration
const TEMPLATES = "d:/www/servers/template-generator" // TODO: temporary


let deployer = new Deployer(cfg.devops)

deployer
    .option('-e, --env <name>', 'The target env name')
    .option('-l, --location <name>', 'The target location')

    .run(async () => {
        // Configuration
        const OPERATOR = deployer.params.env
        const LOCATION = deployer.params.location
        const DEST = `/home/dopamine/production/${cfg.operators[OPERATOR].dir}`
        
        if (!cfg.operators[OPERATOR]) throw Error(`missing configuration for this env ${OPERATOR}`)
        if (cfg.operators[OPERATOR].live !== false) throw Error(`This env ${OPERATOR} is used already on live, so for security reasons the command is disabled for it`)
        if (!/^[a-zA-Z0-9-_/]+$/g.test(DEST) || DEST.length <= '/home/dopamine/production/'.length) {
            throw Error(`The destination (${DEST}) is invalid and this could be VERY dangerous!`)
        }
        
        
        // Preparations
        log(`Before the deploy you must prepare all configurations using:\n $ node bin/hermes-env/prepare --env ${OPERATOR} --location ${LOCATION}`)
        await deployer.confirm('Have you prepared them (yes)? ')
        // TODO check if they exists



    
        // Prepare and check ssh connections
        let hosts = cfg.locations[LOCATION].hosts
        let [web1, master, archive] = await Promise.all([
            deployer.ssh(hosts.web1, 'dopamine'),
            deployer.mysql({user: 'root', ssh: {user: 'root', host: hosts.mysql}}),
            deployer.mysql({user: 'root', ssh: {user: 'root', host: hosts.archive}}),
        ])
        let shell = deployer.shell()
    

    
        // Creating the environment
        log("Adding code on webs..")
        await web1.exec(`git clone git@gitlab.dopamine.bg:releases/hermes.git ${DEST}`)
        
        await web1.exec(`chmod 777 ${DEST}/wallet/logs && chmod 777 ${DEST}/gpanel/exports`)
        await shell.exec(`scp -r ${TEMPLATES}/output/${OPERATOR}/hermes/* dopamine@${hosts.web1}:${DEST}`)
        await web1.exec(`/home/dopamine/bin/webs-sync ${DEST}`)
        
        log("Setup chroot")
        let web1Root = await deployer.ssh(hosts.web1, 'root') // TODO: check why requires root
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
        log('Importing master seed..') // TODO: too much seeds making peaks
        await master.query(read(`${TEMPLATES}/output/${OPERATOR}/db/seed.sql`))
    
    
        // Crons
        log(`\nExecuting initial crons`)
        await web1.exec(`php platform/bin/cmd.php exchange-rates`)
    
        // System configurations
        log('\nUpdate system configurations')
        log('This could affect the other envs if the setup is incorrect.')
        await deployer.confirm('DANGER! Are you sure you want to continue (yes)? ')
        await shell.exec(`node bin/servers-conf/update --locations ${LOCATION}`)
    
        // Checkers & tests
        await shell.exec(`node bin/hermes-env/check --env ${OPERATOR} --location ${LOCATION}`)
        
        
    
    })