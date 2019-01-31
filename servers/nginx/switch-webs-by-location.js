#!/usr/bin/env node
'use strict';

const Program = require('dopamine-toolbox').Program
const SSHClient = require('dopamine-toolbox').SSHClient
const cfg = require('configurator')
const uniq = (arr) => arr.filter((el, i, arr) => i === arr.indexOf(el))

let program = new Program({ chat: cfg.chat.rooms.devops })

program
    .description('Switch between webs used by locations')
    
    .option('-w, --webs <webs|all>', 'Comma-separated list on which webs to be executed', { required: true })
    .option('-l, --locations <location|all>', 'Comma-separated list of location (this wil filter the operators in defined location)', { choices: Object.keys(cfg.locations), required: true })
    .option('--exclude-webs <webs>', 'Comma-separated list on which webs to be EXCLUDED from the --webs list')
    
    .example(`
        $ switch-webs --webs=all  --operators=all
        $ switch-webs --webs=web1 --operators=all
        $ switch-webs --webs=all  --operators=all --exclude-webs=web1,web2
        $ switch-webs --webs=web1,web2 --operators=rtg,bots --no-reload
    `)
    .parse()



program.iterate('locations', async (location) => {
    await program.chat.message(`\n# Switching webs in ${location} for all operators`)
    
    const lb = await new SSHClient().connect({host: cfg.locations[location].hosts.lb, username: 'root'})
    const CMD = `switch-webs --webs=${program.params.webs} --operators=all` + (program.params.excludeWebs ? ` --exclude-webs=${program.params.excludeWebs}` : '')
    await lb.exec(CMD)
    await lb.disconnect()
})
