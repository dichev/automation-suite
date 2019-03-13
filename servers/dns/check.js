#!/usr/bin/env node
'use strict';

const Program = require('dopamine-toolbox').Program
const cfg = require('configurator')
const CloudFlare = require('dopamine-toolbox').plugins.CloudFlare

let program = new Program()

program
    .description('Check ip of all dns records for desired operator')
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
    
        for (let address of addresses){
            let response = await cf.get('dns_records?per_page=100&type=A&name=' + address)
            if(!response.result.length) throw Error('Missing record for: ' + address)
            if(!response.result.length>1) throw Error('Danger! Found more than 1 record for: ' + address)
            
            let record = response.result[0]
            let isPanel = record.name.startsWith('gpanel') //TODO: gpanel is still not behind CF
            let desiredIp = cfg.locations[operator.location].externalIps.incoming
            console.log(record.content.padEnd(15) + (record.proxied ? '(cf) ' : '     ') +  ' => ' + desiredIp.padEnd(15) + (!isPanel ? '(cf) ' : '     ') + record.name)
        }
    })


