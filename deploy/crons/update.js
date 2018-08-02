#!/usr/bin/env node
'use strict';

const Program = require('dopamine-toolbox').Program
const cfg = require('configurator')

const LOCATIONS = Object.values(cfg.locations).filter(l => l.live).map(l => l.name)

let program = new Program()

program
    .description('Update crons to match the seed repo')
    .example(`
        node deploy/crons/update --locations belgium
        node deploy/crons/update --locations belgium --rev r3.9.9.0
    `)
    .option('-l, --locations <list|all>', `Comma-separated list of locations`, {choices: LOCATIONS, required: true})
    .option('-r, --rev <string>', `Target revision (like r3.9.9.0)`)
    
    .iterate('locations', async (location) => {
        const REV = program.params.rev
        if(!REV) await program.ask(`Warning! You did't define revision and that could be dangerous because the crons will be updated to the current working tree.\nDo you want to continue?`)
    
        let web1 = await program.ssh(cfg.locations[location].hosts.web1, 'dopamine')
        
        if(!await web1.exists('seed')) {
            await web1.exec(`git clone git@gitlab.dopamine.bg:releases/hermes.seed.git seed`)
            await web1.exec(`mkdir -p seed/crontab/backups`)
        }
    
        console.log(`Fetching changes..`)
        await web1.chdir('seed')
        await web1.exec(`git fetch --prune`)
        await web1.exec(`git reset --hard ${REV ? REV : 'origin/master'}`)
    
        let backupFile = `crontab/backups/crontab-${Date.now()}.txt`
        console.log(`Backup to ${backupFile}..`) // will save the day
        await web1.exec(`crontab -l > ${backupFile}`)
        
        let updateFile = `crontab/crontab-${location}.txt`
        console.log(`Update crons with ${updateFile}`)
        await web1.exec(`crontab < ${updateFile}`)
    })

