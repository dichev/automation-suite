#!/usr/bin/env node
'use strict';

/**
 * Usage:
 * $ node bin/servers-conf/list-changes --hosts all
 */

const Deployer = require('deployer2')
const cfg = require('configurator')

let deployer = new Deployer(cfg.devops)
deployer
    .option('-l, --locations <list|all>', 'The target host name', {choices: Object.keys(cfg.locations)})
    .loop('locations')
    .run(async (location) => {
        
        let lb = await deployer.ssh(cfg.locations[location].hosts.lb, 'root')
        await lb.chdir('/opt/servers-conf')
        await lb.exec('git fetch origin master --quiet')
        await lb.exec('git log HEAD..origin/master --oneline')
        await lb.exec('git diff HEAD..origin/master --name-status')
    })
