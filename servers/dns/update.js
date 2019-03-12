#!/usr/bin/env node
'use strict';

const Program = require('dopamine-toolbox').Program
const cfg = require('configurator')
const CloudFlare = require('dopamine-toolbox').plugins.CloudFlare

let program = new Program({ chat: cfg.chat.rooms.devops })

program
    .description('Set ip to all dns records for desired operator')
    .option('-o, --operators <list|all>', 'Comma-separated list of the operators', {choices: Object.keys(cfg.operators), required: true })
    
    .iterate('operators', async (name) => {
        const operator = cfg.operators[name]
        const domain = operator.domain
        const addresses = [
            `gserver-${operator.dir}.${domain}`,
            `gpanel-${operator.dir}.${domain}`,
            `feed-${operator.dir}.${domain}`,
        ]
    
        const z = cfg.cloudflare.zones[domain]
        let cf = new CloudFlare(z.zone, z.email, z.key)
        cf.silent = true
    
        for (let address of addresses) {
            let records = await cf.get(`dns_records?name=${address}`)
            let found = records.result.find(r => r.name === address)
            
            let record = {
                type: 'A',
                name: address,
                content: cfg.locations[operator.location].externalIps.incoming,
                proxied: !address.startsWith('gpanel') //TODO: gpanel is still not behind CF
            }
            
            if (found) {
                console.log(`UPDATE: ` + record.content.padEnd(15) + (record.proxied ? '(cf) ' : '     ') + record.name)
                await cf.put('dns_records/' + found.id, record)
            }
            else {
                console.log(`ADDING: ` + record.content.padEnd(15) + (record.proxied ? '(cf) ' : '     ') + record.name)
                await cf.post('dns_records', record)
            }
        
        }
    })


