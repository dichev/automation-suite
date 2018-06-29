#!/usr/bin/env node
'use strict';

/**
 * Usage:
 * $ node bin/cloudflare/check --zones dev,gib
 */

const Deployer = require('deployer2')
const CloudFlare = require('deployer2').plugins.CloudFlare
const secret = require('./.secret') // TODO: temporary stored here
const zones = Object.keys(secret)

let deployer = new Deployer({ zones: Object.keys(secret) })

deployer
    .option('-z, --zones <list|all>', `Comma-separated list of cloudflare zone aliases. Available: ${zones}`, { choices: zones })
    .loop('zones')

    .run(async (zone) => {
        
        const cfg = secret[zone]
        
        let cf = new CloudFlare(cfg.zone, cfg.email, cfg.key)
        
        await cf.get('custom_pages/ratelimit_block')
        await cf.get('custom_pages/ip_block')
        await cf.get('custom_pages/500_errors')
        await cf.get('custom_pages/1000_errors')
        await cf.get('custom_pages/always_online')

        await cf.get('settings/ipv6')
        await cf.get('settings/security_level')
        
        await cf.get('pagerules')
    
    })
