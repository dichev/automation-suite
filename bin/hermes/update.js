#!/usr/bin/env node
'use strict';

/**
 * Usage:
 * $ node bin/hermes/update --operators bots --rev r3.9.9.1 --strategy blue-green --allow-panel --force
 */

/*
const tag         = 'r3.9.9.1'
const allowGPanel = false
const tests       = false
const isBlueGreen = false
const autoConfirm = true
 */

const Program = require('dopamine-toolbox').Program
const cfg = require('configurator')


let program = new Program()

program
    .description('Direct update of hermes release version')
    .option('-o, --operators <list|all>', `Comma-separated list of operators. Available: ${Object.keys(cfg.operators)}`, {choices: Object.keys(cfg.operators), required: true})
    .option('-r, --revision <string>', `Target revision (like r.3.9.9.0) or from..to revision (like r3.9.9.0..r3.9.9.1)`, {required: true})
    .option('-a, --allow-panel', `Allow QA access to GPanel`)
    .loop('operators')
    
    .run(async (operator) => {
        if (operator !== 'bots') throw Error('This script is not production ready, so is allowed only for the "bots" env')
    
        const location = cfg.getLocationByOperator(operator);
        const DEST = 'production/' + cfg.operators[operator].dir
        const REVS = program.params.revision
        const [from, to] = REVS && REVS.includes('..') ? REVS.split('..') : [null, REVS]
        
        let chat = program.chat
        let shell = program.shell()
    
    
        // Prepare
        await chat.notify('\nPhase 0: Pre-deploy validations')
        await shell.exec(`node bin/hermes/version --quiet -o ${operator}`)
        try {
            await shell.exec(`node bin/hermes/check --quiet -o ${operator} ` + (REVS ? `-r ${REVS}` : ''))
        } catch (e) {
            await program.ask('WARNING! Some test failed! Are you sure you want to continue?', ['yes', 'no'], 'yes')
            // throw e
        }
        if (program.params.allowPanel) {
            await shell.exec(`node bin/hermes/allow-panel-access -o ${operator}`)
        }
    
    
        // Update web1
        await chat.notify('\nPhase 1: update code on web1 (public)')
        await program.confirm(`Continue (yes)?`)
        let web1 = await program.ssh(location.hosts.web1, 'dopamine')
        await web1.chdir(DEST)
        await web1.exec('git fetch --prune origin --quiet')
        await web1.exec(`git checkout --quiet --force -B master ${to}`)
        console.info(`The version is switched to ${to}`)
        
    
        
        // Populate to the other webs
        await chat.notify(`\nPhase 2: update code to all other webs (public)`)
        await program.confirm(`Continue (yes)?`)
        await web1.exec(`$HOME/bin/webs-sync .`, { silent: true })
        await chat.notify(`${to} deployed to ${operator}`, { color: 'green' })
        
        
        
        // Validations
        await chat.notify(`\nPhase 3: QA validation`)
        await chat.notify(`Please validate and let me know when you are ready`, { color: `yellow`} )
        //
        // await ssh.chdir(`production/` + cfg.operators[operator].dir)
        // await ssh.exec(`echo "$(git name-rev --tags --name-only $(git rev-parse HEAD)) -> ${operator}"`)
    
    })
