#!/usr/bin/env node
'use strict';

const Program = require('dopamine-toolbox').Program
const cfg = require('configurator')


let program = new Program({chat: cfg.chat.rooms.test})

program
    .description('Direct update of hermes release version')
    .option('-o, --operators <list|all>', `Comma-separated list of operators`, {choices: Object.keys(cfg.operators), required: true})
    .option('-r, --rev <string>', `Target revision (like r.3.9.9.0) or from..to revision (like r3.9.9.0..r3.9.9.1)`, {required: true})
    .option('-s, --strategy <direct|blue-green>', `Choose deployment strategy`, { def: 'blue-green', choices: ['direct', 'blue-green'] })
    .option('--allow-panel', `Allow QA access to GPanel`)
    .example(`
        node bin/hermes/update --operators bots --rev r3.9.9.1 --strategy blue-green --allow-panel --force
    `)
    .loop('operators')
    
    .run(async (operator) => {
        if (operator !== 'bots' && operator !== 'rtg') throw Error('This script is not production ready, so is allowed only for the "bots|rtg" env')
        if (program.params.parallel) throw Error(`Currently the command doesn't support parallel mode for safety reasons`)
    
        const location = cfg.getLocationByOperator(operator);
        const DEST = 'production/' + cfg.operators[operator].dir
        const REVS = program.params.rev
        const STRATEGY = program.params.strategy
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
    
        if(STRATEGY === 'direct') {
    
            // Update web1
            await chat.notify('\nPhase 1: update code on web1 (public)')
            await program.confirm(`Continue (yes)?`)
            let web1 = await program.ssh(location.hosts.web1, 'dopamine')
            await web1.chdir(DEST)
            await web1.exec('git fetch --prune origin --quiet')
            await web1.exec(`git reset --hard --quiet ${to}`)
            console.info(`The version is switched to ${to}`)
    
    
            // Populate to the other webs
            await chat.notify(`\nPhase 2: update code to all other webs (public)`)
            await program.confirm(`Continue (yes)?`)
            await web1.exec(`$HOME/bin/webs-sync .`, {silent: true})
            await chat.notify(`${to} deployed to ${operator}`, {color: 'green'})
    

            // Validations
            await chat.notify(`\nPhase 3: QA validation`)
            await chat.notify(`Please validate and let me know when you are ready`, {color: `yellow`})
        }
        
        else if( STRATEGY === 'blue-green'){
            
            let [web1, lb] = await Promise.all([
                program.ssh(location.hosts.web1, 'dopamine'),
                program.ssh(location.hosts.lb, 'root')
            ])
    
            // Switch to green
            await chat.notify('Phase 1: Switch to green (web4,web5)')
            await lb.exec(`switch-webs --webs=${location.green} --operators=${operator}`)
    
    
            // Update web1
            await chat.notify('Phase 2a: Update blue (web1)')
            await web1.chdir(DEST)
            await web1.exec('git fetch --prune origin --quiet')
            await web1.exec(`git reset --hard --quiet ${to}`)
    
    
            // Update web2,web3
            await program.confirm(`\nDo you want to populate changes to blue?`)
            let otherBlueWebs = location.blue.filter(w => w !== 'web1')
            if (!otherBlueWebs.length) {
                console.log('No other webs, skipping..')
            } else {
                await chat.notify(`Phase 2b: Update blue (${otherBlueWebs})`)
                await web1.exec(`$HOME/bin/webs-sync . --webs=${otherBlueWebs}`, {silent: true})
            }
    
            // Switch to blue
            await program.confirm(`\nDo you want to switch to blue?`)
            await chat.notify('Phase 3: Switch to blue')
            await lb.exec(`switch-webs --webs=${location.blue} --operators=${operator}`)
    
    
            // QA time
            await chat.notify('Phase 4: QA validation')
            await chat.notify('Please validate and let me know when you are ready', { color: 'yellow', popup: true })
    
            
            // Rollback?
            let answer = await program.ask('Do you need to ROLLBACK?', ['rollback', ''], '')
            if (answer === 'rollback') {
                await chat.notify('Something is wrong, we will rollback by switching to green', { color: 'red' })
                await lb.exec(`switch-webs --webs=${location.green} --operators=${operator}`)
                await chat.notify('Switched to green, please confirm everything is fine', { color: 'yellow' })
                throw Error('Aborting')
            }
            
    
            // Update green webs
            await chat.notify(`Phase 5: Update green (${location.green})`)
            await web1.exec(`$HOME/bin/webs-sync . --webs=${location.green}`, {silent: true})
    
            // Switch to all webs (green & blue)
            let allWebs = [].concat(location.blue, location.green)
            await chat.notify(`Phase 6: Switch to blue & green: ${allWebs}`)
            await lb.exec(`switch-webs --webs=${allWebs} --operators=${operator}`)
            await chat.notify(`${to} deployed to ${operator}`, {color: 'green'})
        }
        else {
            throw Error(`There is no such strategy: ${STRATEGY}`)
        }
        
    
    })
