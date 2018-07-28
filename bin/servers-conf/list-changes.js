#!/usr/bin/env node
'use strict';

/**
 * Usage:
 * $ node bin/servers-conf/list-changes --locations all
 */

const Program = require('dopamine-toolbox').Program
const cfg = require('configurator')

let program = new Program({ chat: cfg.chat.rooms.devops })
program
    .option('-l, --locations <list|all>', 'The target host name', {choices: Object.keys(cfg.locations), required: true})
        .iterate('locations', async (location) => {
        
        let lb = await program.ssh(cfg.locations[location].hosts.lb, 'root')
        await lb.chdir('/opt/servers-conf')
        await lb.exec('git fetch origin master --quiet')
        await lb.exec('git log HEAD..origin/master --oneline')
        await lb.exec('git diff HEAD..origin/master --name-status')
    })
