#!/usr/bin/env node
'use strict';

/**
 * Usage:
 * $ node bin/cloudflare/get --zones all --url settings/ipv6
 */

const Deployer = require('deployer2')
const cfg = require('configurator')
const CloudFlare = require('deployer2').plugins.CloudFlare
const zones = Object.keys(cfg.cloudflare.zones)
const assert = require('assert')


let deployer = new Deployer(cfg.devops)

deployer
    .description('Checking current cloudflare configuration')
    .option('-z, --zones <list|all>', `Comma-separated list of cloudflare zone aliases. Available: ${zones}`, { choices: zones })
    .option('-u, --url <string>', `Cloudflare url without the zone part`, { def: 'settings/security_level' })
    .loop('zones')

    .run(async (zone) => {
        
        const z = cfg.cloudflare.zones[zone]
        let cf = new CloudFlare(z.zone, z.email, z.key)
        await cf.get(deployer.params.url)
    })
