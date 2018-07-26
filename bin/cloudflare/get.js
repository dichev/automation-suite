#!/usr/bin/env node
'use strict';

/**
 * Usage:
 * $ node bin/cloudflare/get --zones all --url settings/ipv6
 */

const Program = require('dopamine-toolbox').Program
const cfg = require('configurator')
const CloudFlare = require('dopamine-toolbox').plugins.CloudFlare
const zones = Object.keys(cfg.cloudflare.zones)


let program = new Program(cfg.devops)

program
    .description('Checking current cloudflare configuration')
    .option('-z, --zones <list|all>', `Comma-separated list of cloudflare zone aliases. Available: ${zones}`, { choices: zones })
    .option('-u, --url <string>', `Cloudflare url without the zone part`, { def: 'settings/security_level' })
    .loop('zones')

    .run(async (zone) => {
        
        const z = cfg.cloudflare.zones[zone]
        let cf = new CloudFlare(z.zone, z.email, z.key)
        await cf.get(program.params.url)
    })
