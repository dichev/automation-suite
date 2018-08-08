#!/usr/bin/env node
'use strict';

/**
 * Usage:
 * $ node deploy/hermes-env/prepare --env bots --location belgium -v
 */


const Program = require('dopamine-toolbox').Program
const cfg = require('configurator')
const CloudFlare = require('dopamine-toolbox').plugins.CloudFlare
const deepMerge = require('deepmerge')
const fs = require('fs')
const log = console.log

//---------------------
const emptyTarget = value => Array.isArray(value) ? [] : {}
const clone = (value, options) => deepMerge(emptyTarget(value), value, options)
function combineMerge(target, source, options) {
    const destination = target.slice()
    
    source.forEach(function(e, i) {
        if (typeof destination[i] === 'undefined') {
            const cloneRequested = options.clone !== false
            const shouldClone = cloneRequested && options.isMergeableObject(e)
            destination[i] = shouldClone ? clone(e, options) : e
        } else if (options.isMergeableObject(e)) {
            destination[i] = deepMerge(target[i], e, options)
        } else if (target.indexOf(e) === -1) {
            destination.push(e)
        }
    })
    return destination
}
//---------------------

// Configuration
const TEMPLATES = "d:/www/servers/template-generator"
const GRAFANA   = "d:/www/servers/grafana-sensors";

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
            }
    
            
            
            // Templating the Monitoring System
            log("Generating monitoring configurations from templates..")
            let shell = await program.shell()
            await shell.chdir(TEMPLATES)
            await shell.exec(`bin/generator -t templates/monitoring/monitoring.json.hbs -s ${SERVER} -o ${OPERATOR} -d ${SERVER}/${OPERATOR}/monitoring/${OPERATOR}.json`)
            await shell.exec(`bin/generator -t templates/monitoring/sensors.json.hbs    -s ${SERVER} -o ${OPERATOR} -d ${SERVER}/${OPERATOR}/monitoring/${OPERATOR}-sensors.json`)
    
            // Append new config to sensors.json
            let sensors         = JSON.parse(fs.readFileSync(`${GRAFANA}/config/sensors.json`, 'utf8'));
            let operatorSensors = JSON.parse(fs.readFileSync(`${TEMPLATES}/output/${SERVER}/${OPERATOR}/monitoring/${OPERATOR}-sensors.json`, 'utf8'));
    
            // Merge objects
            const result = deepMerge(sensors, operatorSensors,{arrayMerge: combineMerge});
    
            // Save to sensors.json
            fs.writeFileSync(`${GRAFANA}/config/sensors.json`, JSON.stringify(result, null, 4));
    
            log("Coping operator config file to GRAFANA")
            await shell.exec(`cp ${TEMPLATES}/output/${SERVER}/${OPERATOR}/monitoring/${OPERATOR}.json ${GRAFANA}/config/operators/${OPERATOR}.json`);
    
            log("Please review and commit the changes")
            await shell.exec(`cd ${GRAFANA} && TortoiseGitProc -command commit -logmsg "[env] Add new env: ${OPERATOR}"`)
            
            
            log('Done')
        }
    })


