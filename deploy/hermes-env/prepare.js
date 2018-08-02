#!/usr/bin/env node
'use strict';

/**
 * Usage:
 * $ node deploy/hermes-env/prepare --env bots --location belgium -v
 */


const Program = require('dopamine-toolbox').Program
const cfg = require('configurator')
const CloudFlare = require('dopamine-toolbox').plugins.CloudFlare

const log = console.log


// Configuration
const TEMPLATES = "d:/www/servers/template-generator"

let program = new Program({ chat: cfg.chat.rooms.devops })


program
    .option('-e, --env <name>', 'The target env name', { required: true })
    .option('-l, --location <name>', 'The target location', { required: true })

    .run(async () => {
        const OPERATOR = program.params.env
        const SERVER = program.params.location


        // Templating the environment
        log("Generating configurations from templates..")
        let shell = await program.shell()
        await shell.chdir(TEMPLATES)
        await shell.exec(`bin/generator-new-operator -o ${OPERATOR} -s ${SERVER}`)


        log("Please review and commit the server configurations")
        await shell.exec(`cd ../servers-conf-${SERVER} && TortoiseGitProc -command commit -logmsg "[env] Add new env: ${OPERATOR}"`)
        log("\n\n===================================================\n\n")



        // Check domain DNS
        log(`\nChecking DNS records of the domains`);
        const DOMAIN = cfg.operators[OPERATOR].domain
        let addresses = [
            `gserver-${OPERATOR}.${DOMAIN}`,
            `gpanel-${OPERATOR}.${DOMAIN}`
        ]
    
        const z = cfg.cloudflare.zones[DOMAIN]
        let cf = new CloudFlare(z.zone, z.email, z.key)
        cf.silent = true
        
        for (let address of addresses) {
            let records = await cf.get(`dns_records?name=${address}`)
            let found = records.result.find(r => r.name === address)
            
            if(found) {
                log(`- DNS is found at CloudFlare: ${address}`);
            } else {
                log(`- DNS is NOT found at CloudFlare: ${address}`);
                log(`Adding ${address} to Cloudflare at zone ${SERVER}`);
                
                let isPanel = address.startsWith('gpanel')
                
                await cf.post('dns_records', {
                    type: 'A',
                    name: address,
                    content: isPanel ? cfg.locations[SERVER].hosts.private : cfg.locations[SERVER].hosts.public, // TODO: temporary!
                    proxied: !isPanel //TODO: gpanel is still not behind CF
                })
                console.log('Done')
            }
        }
    })


