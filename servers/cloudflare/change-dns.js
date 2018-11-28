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
    .option('--ip <value>', `The DNS target ip. If is not passed they will be just listed`)
    
    .iterate('zones', async (zone) => {
        
        const IP = program.params.ip || false
    
        const z = cfg.cloudflare.zones[zone]
        let cf = new CloudFlare(z.zone, z.email, z.key)
        cf.silent = true
    
        let response = await cf.get('dns_records?per_page=100&type=A')
        let records = response.result.filter(r => r.name.search(/gserver-|gpanel-/) !== -1)
                                  // .filter(r=>r.name.includes('rtg')) // for testing
    
        console.log(`Found ${records.length} records:`)
        for (let record of records) console.log(record.content, record.name)
        
        if(IP) {
            await program.confirm(`[DANGEROUS] Are you sure you want to set all to ${IP}?`)
            for (let record of records) {
                console.log(`Set ${IP} to ${record.name}`)
                await cf.put('dns_records/'+record.id, {
                    name: record.name,
                    content: IP,
                    type: 'A'
                })
            }
            console.log('Done')
        } else {
            console.log('To change the ip you should pass --ip parameter')
        }
    
        
    })


