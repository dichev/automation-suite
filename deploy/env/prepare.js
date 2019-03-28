#!/usr/bin/env node
'use strict'

/**
 * Usage:
 * $ node deploy/env/prepare --operator bots --location belgium -v
 */


const Program = require('dopamine-toolbox').Program
const SSHClient = require('dopamine-toolbox').SSHClient
const cfg = require('configurator')
const CloudFlare = require('dopamine-toolbox').plugins.CloudFlare
const log = console.log

// Configuration
const OUTPUT = __dirname.replace(/\\/g, '/') + '/output'
const ANOMALY = "d:/www/tools/anomaly"

let program = new Program({ chat: cfg.chat.rooms.deployBackend })


program
    .option('-o, --operator <name>', 'The target operator name', { required: true, choices: Object.keys(cfg.operators) })

    .run(async () => {
        const OPERATOR = program.params.operator
        const LOCATION = cfg.operators[OPERATOR].location
        let shell = await program.shell()

        // Templating the environment
        log("Generating operators configurations from templates..")
        await shell.exec(`node generators/generate-new-operator -o ${OPERATOR} --dest ${OUTPUT}`)
    
        log("Generating servers configurations from templates..")
        log("Please review and commit the server configurations")
        await shell.exec(`node generators/generate-servers-conf -l ${LOCATION} --commit "[env] Add new operator: ${OPERATOR}"`)
        log("\n\n===================================================\n\n")



        // Check domain DNS
        log(`\nChecking DNS records of the domains`)
        await shell.exec(`node servers/dns/update -o ${OPERATOR}`)
        
        console.log('\nReload office dns cache..')
        let sshOfficeDNS = await new SSHClient().connect({host: cfg.hosts['sofia-office-dhcp-main'].ip, username: 'root'})
        await sshOfficeDNS.exec('/etc/init.d/bind9 restart')
        await sshOfficeDNS.disconnect()
        
        log('Updating anomaly project')
        await shell.exec(`cd ${ANOMALY} && git pull && npm i configurator`)
            
        log('Done')
    
    })


