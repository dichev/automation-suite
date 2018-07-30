#!/usr/bin/env node
'use strict';

/**
 * Usage:
 * $ node servers/cloudflare/check --zones dopamine-gaming.com
 */

const Program = require('dopamine-toolbox').Program
const CloudFlare = require('dopamine-toolbox').plugins.CloudFlare
const cfg = require('configurator')
const zones = Object.keys(cfg.cloudflare.zones)
const assert = require('assert')


let program = new Program({ chat: cfg.chat.rooms.devops })

program
    .description('Check current cloudflare configuration')
    .option('-z, --zones <list|all>', `Comma-separated list of cloudflare zone aliases`, { choices: zones, required: true })
    
    .iterate('zones', async (zone) => {
        
        const z = cfg.cloudflare.zones[zone]
        let cf = new CloudFlare(z.zone, z.email, z.key)
        cf.silent = true
        
        let tester = program.tester(zone)
        let it = tester.it

        it('have custom error page for ratelimit_block', async () => {
            let res = await cf.get('custom_pages/ratelimit_block')
            assert.ok(res.result.url.includes('error-pages/cf-error-rate-limited.html'), `Unexpected page: ${res.result.url}`)
        })
        it('have custom error page for ip_block', async () => {
            let res = await cf.get('custom_pages/ip_block')
            assert.ok(res.result.url.includes('error-pages/cf-error-blocked.html'), `Unexpected page: ${res.result.url}`)
        })
        it('have custom error page for 500_errors', async () => {
            let res = await cf.get('custom_pages/500_errors')
            assert.ok(res.result.url.includes('error-pages/cf-error-not-available.html'), `Unexpected page: ${res.result.url}`)
        })
        it('have custom error page for 1000_errors', async () => {
            let res = await cf.get('custom_pages/1000_errors')
            assert.ok(res.result.url.includes('error-pages/cf-error-not-available.html'), `Unexpected page: ${res.result.url}`)
        })
        it('have custom error page for always_online', async () => {
            let res = await cf.get('custom_pages/always_online')
            assert.ok(res.result.url.includes('error-pages/cf-error-not-available.html'), `Unexpected page: ${res.result.url}`)
        })
    
    
        it('should have valid page rules', async () => {
            let pattern = `gserver-*.${z.domain}/`
            let rules = await cf.get('pagerules')
            let found = rules.result.find(rule => rule.targets[0].constraint.value === pattern)
        
            assert.ok(found, `Page rule for ${pattern} not found`)
            assert.strictEqual(found.status, 'active')
            assert.deepStrictEqual(found.actions, [
                {"id": "browser_check", "value": "off"},
                {"id": "always_online", "value": "off"},
                {"id": "cache_level", "value": "bypass"}
            ])
        })
    
    
        it('should have all expected settings:', async () => {
            const expected = require('./.expected.settings.json')
            let actual = await cf.get('settings')
            actual = actual.result.map(s => {
                delete s.modified_on
                delete s.time_remaining
                delete s.editable
                return s
            })
        
            for (let b of expected) {
                it(`option ${b.id} is ${b.value}`, () => assert.deepStrictEqual(actual.find(a => a.id === b.id), b))
            }
        })
    
    
        
        await tester.run(false)
    
    })
