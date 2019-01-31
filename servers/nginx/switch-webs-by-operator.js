#!/usr/bin/env node
'use strict';

const Program = require('dopamine-toolbox').Program
const SSHClient = require('dopamine-toolbox').SSHClient
const cfg = require('configurator')
const uniq = (arr) => arr.filter((el, i, arr) => i === arr.indexOf(el))

let program = new Program({ chat: cfg.chat.rooms.devops })

program
    .description('Switch between webs used by the operators')
    
    .option('-w, --webs <webs|all>', 'Comma-separated list on which webs to be executed', { required: true })
    .option('-o, --operators <operators|all>', 'Comma-separated list on which operators to be executed', {choices: Object.keys(cfg.operators), required: true })
    .option('--exclude-webs <webs>', 'Comma-separated list on which webs to be EXCLUDED from the --webs list')
    
    .example(`
        $ switch-webs --webs=all  --operators=all
        $ switch-webs --webs=web1 --operators=all
        $ switch-webs --webs=all  --operators=all --exclude-webs=web1,web2
        $ switch-webs --webs=web1,web2 --operators=rtg,bots --no-reload
    `)
    .parse()



program.run(async () => {
    if (program.params.parallel) throw Error(`Currently the command doesn't support parallel mode for safety reasons`)
    if (!program.params.operators) throw Error('No operators selected')
    
    const OPERATORS = program.params.operators.split(',')
    const LOCATIONS = uniq(OPERATORS.map(o => cfg.operators[o].location)).sort()
    
    for (let location of LOCATIONS) {
        const operators = OPERATORS.filter(o => cfg.operators[o].location === location)
        await program.chat.message(`\n# Switching webs in ${location} for ${operators}`)
        
        const lb = await new SSHClient().connect({host: cfg.locations[location].hosts.lb, username: 'root'})
        const CMD = `switch-webs --webs=${program.params.webs} --operators=${operators}` + (program.params.excludeWebs ? ` --exclude-webs=${program.params.excludeWebs}` : '')
        await lb.exec(CMD)
        await lb.disconnect()
    }
})
