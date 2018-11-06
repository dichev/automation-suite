#!/usr/bin/env node
'use strict';

const Program = require('dopamine-toolbox').Program
const GoogleChat = require('dopamine-toolbox').plugins.GoogleChat
const cfg = require('configurator')

let program = new Program({chat: cfg.chat.rooms.deployBackend, smartForce: true})

program
    .icon(GoogleChat.icons.DEPLOY)
    .description('Fast simultaneous deploy to all operators per location without down time')
    .option('-o, --operators <list|all>', `Comma-separated list of operators`, {choices: Object.keys(cfg.operators)})
    .option('-r, --rev <string>', `Target revision (like r3.9.9.0) or from..to revision (like r3.9.9.0..r3.9.9.1)`, {required: true})
    .option('-s, --strategy <direct|blue-green>', `Choose deployment strategy`, { def: 'blue-green', choices: ['direct', 'blue-green'] })
    .option('--allow-panel', `Allow QA access to GPanel`)
    .example(`
        node deploy/hermes/update-by-location --operators bots --rev r3.9.9.1 --strategy blue-green --force
    `)
    .parse()

program.chat.thread = program.params.rev

program.run(async () => {
    if (program.params.parallel) throw Error(`Currently the command doesn't support parallel mode for safety reasons`)
    if (!program.params.operators) throw Error('No operators selected')
    
    const operatorsByLocation = {}
    for(let name of program.params.operators.split(',')){
        let operator = cfg.operators[name]
        if(!operatorsByLocation[operator.location]) operatorsByLocation[operator.location] = []
        operatorsByLocation[operator.location].push(operator)
    }
    
    const locations = Object.keys(operatorsByLocation).sort()
   
    
    for(let location of locations){
        let chat = program.chat
        await chat.message(`*Executing over ${location}*`)
        await program.confirm('Continue?')
        

        const REVS = program.params.rev
        const STRATEGY = program.params.strategy
        const [from, to] = REVS && REVS.includes('..') ? REVS.split('..') : [null, REVS]
        
        const OPERATORS = operatorsByLocation[location]
        const LOCATION = cfg.locations[location]
        const BASE_DIR = '/home/dopamine/production'
        
        
        let shell = program.shell()
    
    
        await chat.message(`Affected operators: ` + OPERATORS.map(o => o.name).join(', '))
    
        // Prepare
        await chat.message('\n• Pre-deploy validations')
        try {
            await shell.exec(`node deploy/hermes/check -p 5 --quiet --force --no-chat -o ${OPERATORS.map(o => o.name)} ` + (REVS ? `-r ${REVS}` : '')) //TODO
        } catch (e) {
            let answer = await program.ask('WARNING! Some test failed! Are you sure you want to continue?', ['yes', 'no'], 'no')
            if(answer === 'no') throw e
        }
    
    
        const parallelOperators = async (fn) => {
            await Promise.all(OPERATORS.map(async (operator, i) => {
                await program.sleep(i * 0.5, operator.name)
                await fn(operator)
            }))
        }

        if (program.params.allowPanel) {
            await chat.message('• Allowing QA panel access')
            await shell.exec(`node deploy/hermes/allow-panel-access -o ${OPERATORS.map(o => o.name)} -p 10 --no-chat`)
        }
    
        // if (to === 'r3.10.13.0') {
        //     await chat.message('\n• Executing SQL migrations')
        //     await shell.exec(`node deploy/hermes/migration -m /d/www/_releases/hermes/.migrations/r3.10.13.0/gpanel-r3.10.13.0.sql --db panel -o ${OPERATORS.map(o => o.name)} --force --no-chat`)
        // }
     
        if(STRATEGY === 'direct') {
            
            // Update web1
            await chat.message('\n• Update code on web1 (public)')
            await program.confirm(`Continue (yes)?`)
            let web1 = await program.ssh(LOCATION.hosts.web1, 'dopamine')
            await web1.chdir(BASE_DIR)
    
    
            console.info(`\nFetching changes`)
            await parallelOperators(async operator => {
                await web1.exec(`cd ${operator.dir} && git fetch --prune origin --quiet`)
            })
            
            console.info(`\nSwitching to ${to} on web1`)
            await parallelOperators(async operator => {
                await web1.exec(`cd ${operator.dir} && git reset --hard --quiet ${to}`)
            })
            
            // Populate to the other webs
            await chat.message(`\n• Update code to all other webs (public)`)
            await program.confirm(`Continue (yes)?`)
            await web1.exec(`$HOME/bin/webs-sync ${BASE_DIR}`, {silent: true})
            await chat.message(`✓ ${to} deployed `)
            
        }
        
        else if( STRATEGY === 'blue-green'){
            
            
            let [web1, lb] = await Promise.all([
                program.ssh(LOCATION.hosts.web1, 'dopamine'),
                program.ssh(LOCATION.hosts.lb, 'root')
            ])
            await web1.chdir(BASE_DIR)
    
            
            // Switch to green
            await chat.message('• Switch to green (web4,web5)')
            await lb.exec(`switch-webs --webs=${LOCATION.green} --operators=${OPERATORS.map(o => o.dir)}`)
    
    
            // Update web1
            await chat.message('• Fetch changes')
            await parallelOperators(async operator => {
                await web1.exec(`cd ${operator.dir} && git fetch --prune origin --quiet`)
            })
    
    
            await chat.message('• Update blue (web1)')
            await parallelOperators(async operator => {
                await web1.exec(`cd ${operator.dir} && git reset --hard --quiet ${to}`)
            })
    
    
            // Update web2,web3
            await program.confirm(`\nDo you want to populate changes to blue?`)
            let otherBlueWebs = LOCATION.blue.filter(w => w !== 'web1')
            if (!otherBlueWebs.length) {
                console.log('No other webs, skipping..')
            } else {
                await chat.message(`• Update blue (${otherBlueWebs})`)
                await web1.exec(`$HOME/bin/webs-sync ${BASE_DIR} --webs=${otherBlueWebs}`, {silent: true})
            }
    
            // Switch to blue
            await program.confirm(`\nDo you want to switch to blue?`)
            await chat.message('• Switch to blue')
            await lb.exec(`switch-webs --webs=${LOCATION.blue} --operators=${OPERATORS.map(o => o.dir)}`)
    
    
            
            if(!program.params.force) {
                // QA time
                await chat.message('• QA validation')
                await chat.message('Please validate and let me know when you are ready', {popup: true})
    
                // Rollback?
                let answer = program.params.force ? '' : await program.ask('Do you need to ROLLBACK?', ['rollback', ''], '')
                if (answer === 'rollback') {
                    await chat.warn('Aborting', 'Something is wrong, we will rollback by switching to green')
                    await lb.exec(`switch-webs --webs=${LOCATION.green} --operators=${OPERATORS.map(o => o.dir)}`)
                    await chat.message('Switched to green, please confirm everything is fine', {popup: true})
                    throw Error('Aborting')
                }
            } else {
                await program.sleep(10, 'Waiting a bit just in case'); // TODO: add here some checks
            }
            
            
    
            // Update green webs
            await chat.message(`• Update green (${LOCATION.green})`)
            await web1.exec(`$HOME/bin/webs-sync ${BASE_DIR} --webs=${LOCATION.green}`, {silent: true})
    
            // Switch to all webs (green & blue)
            let allWebs = [].concat(LOCATION.blue, LOCATION.green)
            await chat.message(`• Switch to blue & green: ${allWebs}`)
            await lb.exec(`switch-webs --webs=all --operators=${OPERATORS.map(o => o.dir)}`)
            await chat.message(`✓ ${to} deployed to ${OPERATORS.map(o => o.name)}`)
        }
        else {
            throw Error(`There is no such strategy: ${STRATEGY}`)
        }
    
    }
})
.then(async() => {
    if(program.params.strategy === 'direct') await program.chat.message(`QA validation: Please validate and let me know when you are ready`, {popup: true})
})
