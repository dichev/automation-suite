#!/usr/bin/env node
'use strict';

/**
 * Usage:
 * $ node bin/cloudflare/check --zone dev
 */

const Deployer = require('deployer2')
const CloudFlare = require('deployer2').plugins.CloudFlare
const secret = require('./.secret') // TODO: temporary stored here

let deployer = new Deployer()

deployer
    .option('-z, --zone <dev|gib|iom|pokerstars|asia>', 'Alias name of the cloudflare zone')

    .run(async () => {
    
        const cfg = secret[deployer.params.zone]
        
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
