#!/usr/bin/env node
'use strict';

/**
 * Usage:
 * $ node bin/cloudflare/check --zones dev,gib
 */

const Deployer = require('deployer2')
const cfg = require('configurator')
const CloudFlare = require('deployer2').plugins.CloudFlare
const zones = Object.keys(cfg.cloudflare.zones)

let deployer = new Deployer(cfg.devops)

deployer
    .description('Checking current cloudflare configuration')
    .option('-z, --zones <list|all>', `Comma-separated list of cloudflare zone aliases. Available: ${zones}`, { choices: zones })
    .loop('zones')

    .run(async (zone) => {
        
        const z = cfg.cloudflare.zones[zone]
        let cf = new CloudFlare(z.zone, z.email, z.key)
        
        await cf.get('custom_pages/ratelimit_block')
        await cf.get('custom_pages/ip_block')
        await cf.get('custom_pages/500_errors')
        await cf.get('custom_pages/1000_errors')
        await cf.get('custom_pages/always_online')

        await cf.get('settings/ipv6')
        await cf.get('settings/security_level')
        
        await cf.get('pagerules')
    
    })
