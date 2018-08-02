#!/usr/bin/env node
'use strict';

const Program = require('dopamine-toolbox').Program
const cfg = require('configurator')
const fs = require('fs')

const STORAGE = `d:/www/_releases/hermes.seed/crontab`
const LOCATIONS = Object.values(cfg.locations).filter(l => l.live).map(l => l.name)

let program = new Program()

program
    .description('Check current crons release versions')
    .example(`
        node deploy/crons/fetch --locations all -p
    `)
    .option('-l, --locations <list|all>', `Comma-separated list of locations`, {choices: LOCATIONS, required: true})
    
    .iterate('locations', async (location) => {
        console.log(`${location} | Fetching crons..`)
        let web1 = await program.ssh(cfg.locations[location].hosts.web1, 'dopamine')
        let crons = await web1.exec('crontab -l', { silent: true, trim: false })
        fs.writeFileSync(STORAGE + `/crontab-${location}.txt`, crons.replace(/\r?\n/g, '\r\n'))
    })
    .then(async () => {
        await program.shell().exec(`TortoiseGitProc -command diff -path ${STORAGE} -closeonend 2`)
    })


