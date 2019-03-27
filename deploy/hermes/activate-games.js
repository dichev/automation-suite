#!/usr/bin/env node
'use strict';

const Program = require('dopamine-toolbox').Program
const cfg = require('configurator')
const fs = require('fs')

const REPO = "d:/www/_releases/hermes.seed"
const ANOMALY = "d:/www/tools/anomaly/bin/check.js"
let affectedOperators = [];

let program = new Program({chat: cfg.chat.rooms.deployBackend})

program
    .description(`Activate new games`)
    .option('-o, --operators <name>', 'The target operator name', {required: true, choices: Object.keys(cfg.operators)})
    .option('-w, --week <week>', 'The target week', {required: true})
    .option('--rollback', 'Will restore the previous state of games configurations. In case of production errors this is the fastest route')
    .parse()


Promise.resolve().then(async () => {
    console.log(`Ensure the repo is up to date`)
    await program.shell().exec(`cd ${REPO} && git fetch --quiet --tags && git reset --hard origin/master`)
    
    await program.iterate('operators', async (operator) => {
        const validateGameConfigs = async (state) => {
            try {
                await program.shell().exec(`node ${ANOMALY} -s games -o ${operator}`)
            } catch (e) {
                if (affectedOperators.length > 0) console.log(`\nAffected operators: -${affectedOperators.join(',-')}`)
                throw Error(`[${state}] There are failed test cases.\nPlease investigate.. \n`)
            }
        }
    
        console.log('Running pre-deploy validations..')
        if (!program.params.rollback) await validateGameConfigs('pre-deploy')
        
        let dbs = cfg.databases[cfg.operators[operator].databases]
        let master = await program.mysql({user: 'root', ssh: {user: 'root', host: dbs.master}})
        let dbname = cfg.operators[operator].dbPrefix + 'platform'
        await master.query(`USE ${dbname};`)
    
        
        let FILE_NAME = `${REPO}/games/${program.params.week}/${operator}.sql`
        if (program.params.rollback) {
            await program.confirm('Are you sure you want to revert the previous state of the games configurations? ')
           
            FILE_NAME = `${REPO}/games/${program.params.week}/rollback/${operator}.sql`
        }


        if (fs.existsSync(FILE_NAME)) {
            console.log('Running migration')
            const migration = fs.readFileSync(FILE_NAME).toString()
            await master.query(migration)
    
            console.log('Running post-deploy validations...')
            await validateGameConfigs('post-deploy')

            affectedOperators.push(operator)
        } else {
            if (program.params.rollback) throw Error('Missing rollback migration file!')

            await program.chat.message(`Skipping ${operator}, there is no migration.\n`)
        }
    })
})
