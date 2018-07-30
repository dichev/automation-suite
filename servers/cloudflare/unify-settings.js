#!/usr/bin/env node
'use strict';

/**
 * Usage:
 * $ node servers/cloudflare/unify-settings --zones dopamine-gaming.com
 */

const Program = require('dopamine-toolbox').Program
const cfg = require('configurator')
const CloudFlare = require('dopamine-toolbox').plugins.CloudFlare
const zones = Object.keys(cfg.cloudflare.zones)

let program = new Program({ chat: cfg.chat.rooms.devops })

program
    .description('Unifying cloudflare custom settings')
    .option('-z, --zones <list|all>', `Comma-separated list of cloudflare zone aliases`, { choices: zones, required: true })
    
    .iterate('zones', async (zone) => {
    
        const z = cfg.cloudflare.zones[zone]
        let cf = new CloudFlare(z.zone, z.email, z.key)

        // Disable ipv6
        await cf.patch('settings/ipv6', { value: 'off' })

        // Disable security challenge
        await cf.patch('settings/security_level', { value: 'essentially_off' })
        
        // Disable TLS 1.0
        if(zone === 'm-gservices.com') { // TODO: this is temporary!!
            await cf.patch('settings/min_tls_version', {value: '1.0'})
            console.warn('WARNING! Temporary allowing TLS1.0 for ugs only!')
        } else {
            await cf.patch('settings/min_tls_version', {value: '1.1'})
        }

        // Disable Browser Integrity check
        await cf.patch('settings/browser_check', { value: 'off' })
    
        // Always redirect to https
        await cf.patch('settings/always_use_https', {value: 'on'})
        
        // Always redirect to https
        await cf.patch('settings/ssl', { value: 'strict' })
        
    })


