#!/usr/bin/env node
'use strict';

const Usage = `
    $ node bin/hermes/version --operators all -p 10
`
const Program = require('dopamine-toolbox').Program
const cfg = require('configurator')


let program = new Program({ chat: cfg.chat.rooms.test })

program
    .description('Check current hermes release versions')
    .example(Usage)
    .option('-o, --operators <list|all>', `Comma-separated list of operators}`, {choices: Object.keys(cfg.operators), required: true})
    .loop('operators')
    
    .run(async (operator) => {
        const location = cfg.getLocationByOperator(operator)
        const DEST = 'production/' + cfg.operators[operator].dir
        
        let web1 = await program.ssh(location.hosts.web1, 'dopamine')
        
        await web1.chdir(DEST)
        await web1.exec(`echo "$(git name-rev --tags --name-only $(git rev-parse HEAD)) -> ${operator}"`)
    })
