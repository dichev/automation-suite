#!/usr/bin/env node
'use strict';

/**
 * Usage:
 * $ node bin/cloudflare/unify --zones dev
 */

const Deployer = require('deployer2')
const CloudFlare = require('deployer2').plugins.CloudFlare
const secret = require('./.secret') // TODO: temporary stored here
const zones = Object.keys(secret)

let deployer = new Deployer()

deployer
    .option('-z, --zones <list|all>', `Comma-separated list of cloudflare zone aliases. Available: ${zones}`, { choices: zones })
    .loop('zones')

    .run(async (zone) => {
    
        const cfg = secret[zone]
        
        let cf = new CloudFlare(cfg.zone, cfg.email, cfg.key)
    
        // Set custom pages
        // TODO: sometimes cloudflare can't fetch the html templates with error 502?
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
    
    
        // Disable ipv6
        await cf.patch('settings/ipv6', {
            value: 'off'
        })
    
        // Disable security challenge
        await cf.patch('settings/security_level', {
            value: 'essentially_off'
        })
    
    
        // Create Page Rule
        let pattern = `gserver-*.${cfg.domain}/`
    
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
