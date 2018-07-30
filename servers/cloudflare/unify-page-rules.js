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

      

        // Create Page Rule
        let pattern = `gserver-*.${z.domain}/`

        // remove the same rule if exists
        let rules = await cf.get('pagerules')
        for (let rule of rules.result) {
            console.log('checking rule for:', rule.targets[0].constraint)
            if (rule.targets[0].constraint.value === pattern) {
                console.log('deleting')
                await cf.delete(`pagerules/${rule.id}`)
            }
        }

        // add the rule
        await cf.post('pagerules', {
            status: 'active',
            targets: [{
                target: 'url',
                constraint: {operator: 'matches', value: pattern}
            }], actions: [
                {id: 'always_online', value: 'off'},
                {id: 'browser_check', value: 'off'},
                {id: 'cache_level', value: 'bypass'}
            ]
        })

    
    })
