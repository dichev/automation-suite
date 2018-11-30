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
    
        let response = await cf.get('dns_records?per_page=100&type=A')
        let records = response.result.filter(r => r.name.search(/gserver-|gpanel-/) !== -1)
                                  // .filter(r=>r.name.includes('rtg')) // for testing
    
        console.log(`Found ${records.length} records:`)
        for (let record of records) {
            let dir = record.name.match(/(gserver|gpanel)-(.+)(\.tgp.cash)/)[2]
            let location = Object.values(cfg.operators).find(o => o.dir === dir).location
            record.targetIP = cfg.locations[location].hosts.public
            console.log(record.content, '=>', record.targetIP , record.name)
        }
        
        
        
        if(program.params.update) {
            await program.confirm(`[DANGEROUS] Are you sure you want to set them all?`)
            for (let record of records) {
                console.log(`Set ${record.targetIP} to ${record.name}`)
                let isPanel = record.name.startsWith('gpanel') //TODO: gpanel is still not behind CF
                // console.log({name: record.name, content: record.targetIP, type: 'A'})
                await cf.put('dns_records/'+record.id, { name: record.name,  content: record.targetIP,  type: 'A',  proxied: !isPanel })
            }
            console.log('Done')
        } else {
            console.log('To change the ip you should pass --update parameter')
        }
    
        
    })


