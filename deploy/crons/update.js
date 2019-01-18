#!/usr/bin/env node
'use strict';

const Program = require('dopamine-toolbox').Program
const SSHClient = require('dopamine-toolbox').SSHClient
const cfg = require('configurator')

let program = new Program({chat: cfg.chat.rooms.deployBackend, smartForce: true})

program
    .description('Update crons to match the seed repo')
    .example(`
        node deploy/crons/update --locations belgium
        node deploy/crons/update --locations belgium --rev r3.9.9.0
    `)
    .option('-l, --locations <list|all>', `Comma-separated list of locations`, {choices: Object.keys(cfg.locations).filter(name => name !== 'dev'), required: true})
    .option('-r, --rev <string>', `Target revision (like r3.9.9.0)`)
    
    .iterate('locations', async (location) => {
        const REV = program.params.rev
        if(!REV) await program.confirm(`Warning! You did't define revision and that could be dangerous because the crons will be updated to the current working tree.\nDo you want to continue?`)
    
        let web1 = new SSHClient()
        await web1.connect({host: cfg.locations[location].hosts.web1, username: 'dopamine'})
        
        if(!await web1.exists('seed')) {
            await web1.exec(`git clone git@gitlab.dopamine.bg:releases/hermes.seed.git seed`)
            await web1.exec(`mkdir -p seed/crontab/backups`)
        }
    
        console.log(`Fetching changes..`)
        await web1.chdir('seed')
        await web1.exec(`git fetch -q --prune`)
        await web1.exec('git log HEAD..origin/master --oneline')
        await web1.exec('git diff HEAD..origin/master --name-status')
        await program.confirm('Continue?')
        await web1.exec(`git reset --hard ${REV ? REV : 'origin/master'}`)
    
        let backupFile = `crontab/backups/crontab-${Date.now()}.txt`
        console.log(`Backup to ${backupFile}..`) // will save the day
        await web1.exec(`crontab -l > ${backupFile}`)
        
        let updateFile = `crontab/crontab-${location}.txt`
        console.log(`Update crons with ${updateFile}`)
        await web1.exec(`crontab < ${updateFile}`)
    
        await web1.disconnect()
    })

