#!/usr/bin/env node
'use strict';

/**
 * Usage:
 * $ node bin/hermes-env/prepare --env bots --location belgium -v
 */


const Deployer = require('deployer2')
const cfg = require('configurator')
const CloudFlare = require('deployer2').plugins.CloudFlare

const log = console.log


// Configuration
const TEMPLATES = "d:/www/servers/template-generator"

let deployer = new Deployer(cfg.devops)


deployer
    .option('-e, --env <name>', 'The target env name')
    .option('-l, --location <name>', 'The target location')

    .run(async () => {
        const OPERATOR = deployer.params.env
        const SERVER = deployer.params.location


        // Templating the environment
        log("Generating configurations from templates..")
        let shell = await deployer.shell()
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
                
                await cf.put('dns_records', {
                    type: 'A',
                    name: address,
                    content: isPanel ? cfg.locations[SERVER].hosts.private : cfg.locations[SERVER].hosts.public, // TODO: temporary!
                    proxied: !isPanel //TODO: gpanel is still not behind CF
                })
                console.log('Done')
            }
        }
    })


