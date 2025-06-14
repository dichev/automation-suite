#!/usr/bin/env node
'use strict';

const Program = require('dopamine-toolbox').Program
const SSHClient = require('dopamine-toolbox').SSHClient
const cfg = require('configurator')
const fs = require('fs')

const STORAGE = `d:/www/_releases/hermes.seed/crontab`

let program = new Program({chat: cfg.chat.rooms.devops})

program
    .description('Check crons for manual changes and diffs')
    .example(`
        node deploy/crons/fetch --locations all -p
    `)
    .option('-l, --locations <list|all>', `Comma-separated list of locations`, {choices: Object.keys(cfg.locations).filter(name => name !== 'dev'), required: true})
    
    .iterate('locations', async (location) => {
        console.log(`${location} | Fetching crons..`)
        let web1 = new SSHClient()
        await web1.connect({host: cfg.locations[location].hosts.web1, username: 'dopamine'})
        let crons = await web1.exec('crontab -l', { silent: true, trim: false })
        fs.writeFileSync(STORAGE + `/crontab-${location}.txt`, crons.replace(/\r?\n/g, '\r\n'))
        await web1.disconnect()
    })
    .then(async () => {
        await program.shell().exec(`TortoiseGitProc -command diff -path ${STORAGE} -closeonend 2`)
    })


