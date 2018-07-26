#!/usr/bin/env node
'use strict';

/**
 * Usage:
 * $ node bin/cloudflare/unify-pages --zones dopamine-gaming.com
 */

const Program = require('dopamine-toolbox').Program
const cfg = require('configurator')
const CloudFlare = require('dopamine-toolbox').plugins.CloudFlare
const zones = Object.keys(cfg.cloudflare.zones)

let program = new Program(cfg.devops)

program
    .description('Unifying cloudflare configuration')
    .option('-z, --zones <list|all>', `Comma-separated list of cloudflare zone aliases. Available: ${zones}`, { choices: zones, required: true })
    .loop('zones')

    .run(async (zone) => {
    
        const z = cfg.cloudflare.zones[zone]
        let cf = new CloudFlare(z.zone, z.email, z.key)
        
        console.warn('WARNING! sometimes cloudflare can\'t fetch the html templates with error 502. So you should manually check are the pages really fetched by reloading them via CF UI')
        await program.confirm('Proceed to update? ')

        // Set custom pages
        await cf.put('custom_pages/ratelimit_block', {
            url: `https://cdn.redtiger.cash/error-pages/cf-error-rate-limited.html?c=` + Date.now(),
            state: 'customized'
        })
        await cf.put('custom_pages/ip_block', {
            url: `https://cdn.redtiger.cash/error-pages/cf-error-blocked.html?c=` + Date.now(),
            state: 'customized'
        })
        await cf.put('custom_pages/500_errors', {
            url: `https://cdn.redtiger.cash/error-pages/cf-error-not-available.html?c=` + Date.now(),
            state: 'customized'
        })
        await cf.put('custom_pages/1000_errors', {
            url: `https://cdn.redtiger.cash/error-pages/cf-error-not-available.html?c=` + Date.now(),
            state: 'customized'
        })
        await cf.put('custom_pages/always_online', {
            url: `https://cdn.redtiger.cash/error-pages/cf-error-not-available.html?c=` + Date.now(),
            state: 'customized'
        })

    })
