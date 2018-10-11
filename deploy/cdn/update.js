#!/usr/bin/env node
'use strict';

/**
 * Usage:
 * $ node deploy/cdn/update --hosts dev-hermes-lb --mode blue --revision r4.8.233
 */

const Program = require('dopamine-toolbox').Program
const Shell = require('dopamine-toolbox').Shell
const SSHClient = require('dopamine-toolbox').SSHClient
const installed = require('./.installed')
const cfg = require('configurator')


let program = new Program()

program
    .description('Update games cdn')
    .option('-h, --hosts <list|all>', `Comma-separated list of cdn regions`, {choices: installed.hosts, required: true})
    .option('-r, --revision <string>', `Target revision (like r3.9.9.0)`)
    .option('-m, --mode <blue|green>', `Which cdn to be updated`, { choices: ['blue', 'green'], required: true })

    .iterate('hosts', async (host) => {
        const REV = program.params.revision
        const MODE = program.params.mode
        const DEST = `/home/dopamine/cdn/repos/${MODE}`
        
        let chat = program.chat
        let shell = new Shell()
    
        await chat.notify(`\nUpdating ${host} ${MODE} to ${REV}`)
        
        // Prepare
        await chat.notify('\nPhase 0: Pre-deploy validations')
        await shell.exec(`node deploy/cdn/version --quiet --hosts ${host} --mode ${MODE}`)
        await shell.exec(`node deploy/cdn/check   --quiet --hosts ${host} --mode ${MODE} --revision ${REV}`)
        
        
        // Update cdn files
        await chat.notify('\nPhase 1: Update cdn files')
        let cdn = new SSHClient(program.params.dryRun)
        await cdn.connect({host: cfg.getHost(host).ip, username: 'dopamine'})
        await cdn.chdir(DEST)
        await cdn.exec('git fetch --prune origin --quiet')
        await cdn.exec(`git reset --hard --quiet ${REV}`)
        console.info(`The version is switched to ${REV}`)
        await cdn.disconnect()
        
        // Populate
        await chat.notify('\nPhase 2: Cachebust html assets')
        console.info(`use: \n  $ node cdn/cachebust  --hosts ${host}`)
        

    })
