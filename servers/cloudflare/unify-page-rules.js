#!/usr/bin/env node
'use strict';

/**
 * Usage:
 * $ node servers/cloudflare/unify-page-rules --zones dopamine-gaming.com
 */

const Program = require('dopamine-toolbox').Program
const cfg = require('configurator')
const CloudFlare = require('dopamine-toolbox').plugins.CloudFlare
const zones = Object.keys(cfg.cloudflare.zones)

let program = new Program({ chat: cfg.chat.rooms.devops })

program
    .description('Unifying cloudflare page rules')
    .option('-z, --zones <list|all>', `Comma-separated list of cloudflare zone aliases`, { choices: zones, required: true })
    
    .iterate('zones', async (zone) => {
    
        const z = cfg.cloudflare.zones[zone]
        let cf = new CloudFlare(z.zone, z.email, z.key)
    
    
        const PAGE_RULES = [
            {
                status: 'active',
                targets: [{
                    target: 'url',
                    constraint: {operator: 'matches', value: `gserver-*.${z.domain}/`}
                }], actions: [
                    {id: 'always_online', value: 'off'},
                    {id: 'browser_check', value: 'off'},
                    {id: 'cache_level', value: 'bypass'}
                ]
            },
            {
                status: 'active',
                targets: [{
                    target: 'url',
                    constraint: {operator: 'matches', value: `feed-*.${z.domain}/`}
                }], actions: [
                    {id: 'always_online', value: 'off'},
                    {id: 'browser_check', value: 'off'},
                    {id: 'cache_level', value: 'bypass'}
                ]
            },
        ]
        
        
        for(let options of PAGE_RULES) {
            let pattern = options.targets[0].constraint.value
    
            // check is page rule already exists
            let rules = await cf.get('pagerules')
            let exists = rules.result.find(rule => rule.targets[0].constraint.value === pattern)
    
            if (exists) {
                // update the rule
                await program.confirm(`The page rule for ${pattern} already exists, do you want to replace it? (${exists.id})`)
                await cf.put(`pagerules/${exists.id}`, options)
            } else {
                // add the rule
                console.log(`Adding new rule for ${pattern}`)
                await cf.post('pagerules', options)
            }
    
        }
    
    })
