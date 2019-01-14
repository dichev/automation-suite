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
const CONFIGURATOR   = "d:/www/devops/configurator"

let program = new Program({ chat: cfg.chat.rooms.deployBackend })


program
    .option('-o, --operator <name>', 'The target operator name', { required: true, choices: Object.keys(cfg.operators) })

    .run(async () => {
        const OPERATOR = program.params.operator
        const LOCATION = cfg.operators[OPERATOR].location
        let shell = await program.shell()
    
        log("Please review and commit the configurator")
        await shell.exec(`cd ${CONFIGURATOR} && git add . && TortoiseGitProc -command commit -logmsg "[env] Add new operator: ${OPERATOR}"`)
    
        // Templating the environment
        log("Generating operators configurations from templates..")
        await shell.exec(`node office/templates/generate-new-operator -o ${OPERATOR} --dest ${OUTPUT}`)
    
        log("Generating servers configurations from templates..")
        log("Please review and commit the server configurations")
        await shell.exec(`node office/templates/generate-servers-conf -l ${LOCATION} --commit "[env] Add new operator: ${OPERATOR}"`)
        log("\n\n===================================================\n\n")



        // Check domain DNS
        log(`\nChecking DNS records of the domains`)
        const DOMAIN = cfg.operators[OPERATOR].domain
        let addresses = [
            `gserver-${OPERATOR}.${DOMAIN}`,
            `gpanel-${OPERATOR}.${DOMAIN}`,
            `feed-${OPERATOR}.${DOMAIN}`,
        ]

        const z = cfg.cloudflare.zones[DOMAIN]
        let cf = new CloudFlare(z.zone, z.email, z.key)
        cf.silent = true

        let reload = false
        for (let address of addresses) {
            let records = await cf.get(`dns_records?name=${address}`)
            let found = records.result.find(r => r.name === address)

            if(found) {
                log(`- DNS is found at CloudFlare: ${address}`)
            } else {
                log(`- DNS is NOT found at CloudFlare: ${address}`)
                log(`Adding ${address} to Cloudflare at zone ${LOCATION}`)

                let isPanel = address.startsWith('gpanel')

                await cf.post('dns_records', {
                    type: 'A',
                    name: address,
                    content: isPanel ? cfg.locations[LOCATION].hosts.private : cfg.locations[LOCATION].hosts.public, // TODO: temporary!
                    proxied: !isPanel //TODO: gpanel is still not behind CF
                })
    
                reload = true
            }

        }
        
        if(reload){
            console.log('\nReload office dns cache..')
            let sshOfficeDNS = await new SSHClient().connect({host: cfg.hosts['sofia-dhcp-main'].ip, username: 'root'})
            await sshOfficeDNS.exec('/etc/init.d/bind9 restart')
            await sshOfficeDNS.disconnect()
        }


        log('Done')
    
    })


