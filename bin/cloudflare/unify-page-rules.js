#!/usr/bin/env node
'use strict';

/**
 * Usage:
 * $ node bin/cloudflare/unify-page-rules --zones dopamine-gaming.com
 */

const Deployer = require('deployer2')
const cfg = require('configurator')
const CloudFlare = require('deployer2').plugins.CloudFlare
const zones = Object.keys(cfg.cloudflare.zones)

let deployer = new Deployer(cfg.devops)

deployer
    .description('Unifying cloudflare configuration')
    .option('-z, --zones <list|all>', `Comma-separated list of cloudflare zone aliases. Available: ${zones}`, { choices: zones })
    .loop('zones')

    .run(async (zone) => {
    
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
