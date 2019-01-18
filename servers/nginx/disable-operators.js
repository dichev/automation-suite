#!/usr/bin/env node
'use strict';

const Program = require('dopamine-toolbox').Program
const SSHClient = require('dopamine-toolbox').SSHClient
const cfg = require('configurator')

let program = new Program({ chat: cfg.chat.rooms.devops })
program
    .description('Enable/disable nginx access to operators on specific location')
    
    .option('-l, --locations <list|all>', 'The target host name', {choices: Object.keys(cfg.locations), required: true})
    .option('-o, --operators <list|all>', `Comma-separated list of operators`, {choices: Object.keys(cfg.operators), required: true})
    .option('--enable', `Toggle to reenable them`)

program
    .iterate('locations', async (location) => {
        const lb = await new SSHClient().connect({host: cfg.locations[location].hosts.lb, username: 'root'})
        const DISABLED = program.params.enable !== true
        const OPERATORS = program.params.operators.split(',').map(o => cfg.operators[o]).filter(o => o.location === location)
    
        console.log(DISABLED ? 'Disabling' : 'Enabling' + ' following operators: \n' + OPERATORS.map(o => o.name).join('\n'))
        await program.confirm('Continue?')
        
        if(DISABLED){
            await lb.exec(`mkdir -p /etc/nginx/sites-available`)
            for(let operator of OPERATORS){
                await lb.exec(`mv -f /etc/nginx/sites-enabled/${operator.dir}.conf /etc/nginx/sites-available/${operator.dir}.conf || echo "file not found"`)
            }
        } else {
            for (let operator of OPERATORS) {
                await lb.exec(`mv -f /etc/nginx/sites-available/${operator.dir}.conf /etc/nginx/sites-enabled/${operator.dir}.conf || echo "file not found"`)
            }
        }
        await lb.exec(`cd /etc/nginx && git status -s`)
        
        await program.confirm('Reload nginx?')
        await lb.exec(`nginx -s reload`)
        
        await lb.disconnect()
        console.log('Ready')
    })
