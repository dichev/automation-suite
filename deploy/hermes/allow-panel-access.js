#!/usr/bin/env node
'use strict';

/**
 * Usage:
 * $ node deploy/hermes/allow-panel-access --operators rtg --minutes=15 --role=RT_QAPROD
 */

const Program = require('dopamine-toolbox').Program
const cfg = require('configurator')


let program = new Program({chat: cfg.chat.rooms.test})

program
    .description('Allow QA access to gpanel')
    .option('-o, --operators <list|all>', `Comma-separated list of operators`, {choices: Object.keys(cfg.operators), required: true})
    .option('-m, --minutes <int>', 'Expire after defined minutes', { def: 15 })
    .option('-r, --role <string>', 'Define admin role', { choices: ['RT_QAPROD', 'EXT_Marketing'], def: 'RT_QAPROD' })
    
    .iterate('operators', async (operator) => {
        
        const location = cfg.getLocationByOperator(operator)
        const DEST = 'production/' + cfg.operators[operator].dir
        
        let chat = program.chat
        let web1 = await program.ssh(location.hosts.web1, 'dopamine')
        
        await chat.notify('GPanel access: allowing for QA..')
        await web1.chdir(DEST)
        await web1.exec(`php gpanel/bin/cmd.php activate-qa-users --minutes=${program.params.minutes} --role=${program.params.role}`)
        await chat.notify('GPanel access granted for 15 minutes')
    })
