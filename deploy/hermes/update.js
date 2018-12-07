#!/usr/bin/env node
'use strict';

const Program = require('dopamine-toolbox').Program
const GoogleChat = require('dopamine-toolbox').plugins.GoogleChat
const cfg = require('configurator')

let program = new Program({chat: cfg.chat.rooms.deployBackend, smartForce: true})

program
    .icon(GoogleChat.icons.DEPLOY)
    .description('Deploy hermes release repository without down time')
    .option('-o, --operators <list|all>', `Comma-separated list of operators`, {choices: Object.keys(cfg.operators), required: true})
    .option('-r, --rev <string>', `Target revision (like r3.9.9.0) or from..to revision (like r3.9.9.0..r3.9.9.1)`, {required: true})
    .option('-s, --strategy <direct|blue-green>', `Choose deployment strategy`, { def: 'blue-green', choices: ['direct', 'blue-green'] })
    .option('--allow-panel', `Allow QA access to GPanel`)
    .example(`
        node deploy/hermes/update --operators bots --rev r3.9.9.1 --strategy blue-green --allow-panel --force
    `)
    .parse()

program.chat.thread = program.params.rev
console.warn('THIS SCRIPT IS DEPRECATED IN FAVOUR OF hermes/update-by-location')
process.exit(1)
program
    .iterate('operators', async (operator) => {
        if (program.params.parallel) throw Error(`Currently the command doesn't support parallel mode for safety reasons`)
        if(operator === 'bots') return

        const LOCATION = cfg.getLocationByOperator(operator);
        const OPERATOR_DIR = cfg.operators[operator].dir // TODO: temporary - still used for switch webs
        const DEST = 'production/' + cfg.operators[operator].dir
        const REVS = program.params.rev
        const STRATEGY = program.params.strategy
        const [from, to] = REVS && REVS.includes('..') ? REVS.split('..') : [null, REVS]
        
        let chat = program.chat
        let shell = program.shell()
    
    
        // Prepare
        await chat.message('\n• Pre-deploy validations')
        let currentRev = await shell.exec(`node deploy/hermes/version --no-chat --quiet -o ${operator}`)
        if(currentRev === to){
            let answer = await program.ask(`WARNING! Current release (${currentRev}) is the same as target release (${to})\nDo you want to skip the update?`, ['yes', 'no'], 'yes')
            if(answer === 'yes') return
        }

        try {
            await shell.exec(`node deploy/hermes/check --quiet --no-chat -o ${operator} ` + (REVS ? `-r ${REVS}` : ''))
        } catch (e) {
            await program.ask('WARNING! Some test failed! Are you sure you want to continue?', ['yes', 'no'], 'yes')
            // throw e
        }
        if (program.params.allowPanel) {
            await chat.message('• Allowing QA panel access')
            await shell.exec(`node deploy/hermes/allow-panel-access -o ${operator} --no-chat`)
        }
    
        // if (to === 'r3.10.13.0') {
        //     await chat.message('• Executing SQL migrations')
        //     await shell.exec(`node deploy/hermes/migration -m /d/www/_releases/hermes/.migrations/r3.10.13.0/gpanel-r3.10.13.0.sql --db panel -o ${operator} --force --no-chat`)
        // }
        
        if(STRATEGY === 'direct') {
    
            // Update web1
            await chat.message('\n• Update code on web1 (public)')
            await program.confirm(`Continue (yes)?`)
            let web1 = await program.ssh(LOCATION.hosts.web1, 'dopamine')
            await web1.chdir(DEST)
            await web1.exec('git fetch --prune origin --quiet')
            await web1.exec(`git reset --hard --quiet ${to}`)
            console.info(`The version is switched to ${to}`)
            
            
            // Populate to the other webs
            await chat.message(`\n• Update code to all other webs (public)`)
            await program.confirm(`Continue (yes)?`)
            await web1.exec(`$HOME/bin/webs-sync .`, {silent: true})
            await chat.message(`✓ ${to} deployed to ${operator}`)
            
        }
        
        else if( STRATEGY === 'blue-green'){
            
            let [web1, lb] = await Promise.all([
                program.ssh(LOCATION.hosts.web1, 'dopamine'),
                program.ssh(LOCATION.hosts.lb, 'root')
            ])
    
            // Switch to green
            await chat.message('• Switch to green (web4,web5)')
            await lb.exec(`switch-webs --webs=${LOCATION.green} --operators=${OPERATOR_DIR}`)
    
    
            // Update web1
            await chat.message('• Update blue (web1)')
            await web1.chdir(DEST)
            await web1.exec('git fetch --prune origin --quiet')
            await web1.exec(`git reset --hard --quiet ${to}`)
    
    
            // Update web2,web3
            await program.confirm(`\nDo you want to populate changes to blue?`)
            let otherBlueWebs = LOCATION.blue.filter(w => w !== 'web1')
            if (!otherBlueWebs.length) {
                console.log('No other webs, skipping..')
            } else {
                await chat.message(`• Update blue (${otherBlueWebs})`)
                await web1.exec(`$HOME/bin/webs-sync . --webs=${otherBlueWebs}`, {silent: true})
            }
    
            // Switch to blue
            await program.confirm(`\nDo you want to switch to blue?`)
            await chat.message('• Switch to blue')
            await lb.exec(`switch-webs --webs=${LOCATION.blue} --operators=${OPERATOR_DIR}`)
    
    
            
            if(!program.params.force) {
                // QA time
                await chat.message('• QA validation')
                await chat.message('Please validate and let me know when you are ready', {popup: true})
    
                // Rollback?
                let answer = program.params.force ? '' : await program.ask('Do you need to ROLLBACK?', ['rollback', ''], '')
                if (answer === 'rollback') {
                    await chat.warn('Aborting', 'Something is wrong, we will rollback by switching to green')
                    await lb.exec(`switch-webs --webs=${LOCATION.green} --operators=${OPERATOR_DIR}`)
                    await chat.message('Switched to green, please confirm everything is fine', {popup: true})
                    throw Error('Aborting')
                }
            } else {
                await program.sleep(10, 'Waiting a bit just in case'); // TODO: add here some checks
            }
            
            
    
            // Update green webs
            await chat.message(`• Update green (${LOCATION.green})`)
            await web1.exec(`$HOME/bin/webs-sync . --webs=${LOCATION.green}`, {silent: true})
    
            // Switch to all webs (green & blue)
            let allWebs = [].concat(LOCATION.blue, LOCATION.green)
            await chat.message(`• Switch to blue & green: ${allWebs}`)
            await lb.exec(`switch-webs --webs=all --operators=${OPERATOR_DIR}`)
            await chat.message(`✓ ${to} deployed to ${operator}`)
        }
        else {
            throw Error(`There is no such strategy: ${STRATEGY}`)
        }
        
    
    })
    .then(async() => {
        if(program.params.strategy === 'direct') await program.chat.message(`QA validation: Please validate and let me know when you are ready`, {popup: true})
    })
