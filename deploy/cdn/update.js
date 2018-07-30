#!/usr/bin/env node
'use strict';

/**
 * Usage:
 * $ node bin/cdn/update --hosts dev-hermes-lb --mode blue --revision r4.8.233
 */

const Program = require('dopamine-toolbox').Program
const installed = require('./.installed')
const cfg = require('configurator')


let program = new Program()

program
    .description('Update games cdn')
    .option('-h, --hosts <list|all>', `Comma-separated list of cdn regions`, {choices: installed.hosts, required: true})
    .option('-r, --revision <string>', `Target revision (like r.3.9.9.0)`)
    .option('-m, --mode <blue|green>', `Which cdn to by updated`, { choices: ['blue', 'green'], required: true })
    
    .iterate('hosts', async (host) => {
        const REV = program.params.revision
        const MODE = program.params.mode
        const DEST = `/home/dopamine/cdn/repos/${MODE}`
        
        let chat = program.chat
        let shell = program.shell()
    
        await chat.notify(`\nUpdating ${host} ${MODE} to ${REV}`)
        
        // Prepare
        await chat.notify('\nPhase 0: Pre-deploy validations')
        await shell.exec(`node bin/cdn/version --quiet --hosts ${host} --mode ${MODE}`)
        await shell.exec(`node bin/cdn/check   --quiet --hosts ${host} --mode ${MODE} --revision ${REV}`)
        
        
        // Update cdn files
        await chat.notify('\nPhase 1: Update cdn files')
        let cdn = await program.ssh(cfg.getHost(host).ip, 'dopamine')
        await cdn.chdir(DEST)
        await cdn.exec('git fetch --prune origin --quiet')
        await cdn.exec(`git reset --hard --quiet ${REV}`)
        console.info(`The version is switched to ${REV}`)

        
        // Populate
        await chat.notify('\nPhase 2: Cachebust html assets')
        console.info(`use: \n  $ node cdn/cachebust  --hosts ${host} --mode ${mode} --revision ${REV}`)
        

    })
