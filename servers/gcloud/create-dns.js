#!/usr/bin/env node
'use strict';


const Program = require('dopamine-toolbox').Program
const cfg = require('configurator')
const CloudFlare = require('dopamine-toolbox').plugins.CloudFlare
const zones = Object.keys(cfg.cloudflare.zones)

let program = new Program({ chat: cfg.chat.rooms.devops })

program
    .description('Set ip to all gserver/gpanel dns records of the zone')
    .option('-z, --zones <list|all>', `Comma-separated list of cloudflare zone aliases`, { choices: zones, required: true })
    .option('--update', `Update dns records, otherwise just list them`)
    
    .iterate('zones', async (zone) => {
        const z = cfg.cloudflare.zones[zone]
        let cf = new CloudFlare(z.zone, z.email, z.key)
        cf.silent = true
    
        const prefix = 'feed'
        
        let records = []
        for(let operator of Object.values(cfg.operators).filter(o => o.domain === zone)){
            let record = {
                name: `${prefix}-${operator.dir}.${operator.domain}`,
                content: cfg.locations[operator.location].externalIps.incoming,
                type: 'A',
                proxied: prefix !== 'gpanel'
            }
            records.push(record)
            console.log(record)
        }
        
        if(program.params.update) {
            await program.confirm('Are you sure you want to add them all?')
            for (let record of records) {
                console.log(`Add ${record.content} to ${record.name}`)
                // console.log({name: record.name, content: record.targetIP, type: 'A'})
                try {
                    await cf.post('dns_records', record)
                } catch (e) {
                    console.warn(e.toString())
                }
            }
            console.log('Done')
        } else {
            console.log('To add the dnsyou should pass --update parameter')
        }
    
        
    })


