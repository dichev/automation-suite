#!/usr/bin/env node
'use strict';

/**
 * Usage:
 * $ node bin/hermes/allow-panel-access --operators rtg --minutes=15 --role=RT_QAPROD
 */

const Deployer = require('deployer2')
const cfg = require('configurator')


let deployer = new Deployer()

deployer
    .description('Checking current cloudflare configuration')
    .option('-o, --operators <list|all>', `Comma-separated list of operators. Available: ${Object.keys(cfg.operators)}`, {choices: Object.keys(cfg.operators)})
    .option('-m, --minutes <int>', 'Expire after defined minutes', { def: 15 })
    .option('-r, --role <string>', 'Define admin role', { choices: ['RT_QAPROD', 'EXT_Marketing'], def: 'RT_QAPROD' })
    .loop('operators')
    
    .run(async (operator) => {
        
        const location = cfg.getLocationByOperator(operator)
        const DEST = 'production/' + cfg.operators[operator].dir
        
        let chat = deployer.chat
        let web1 = await deployer.ssh(location.hosts.web1, 'dopamine')
        
        await chat.notify('GPanel access: allowing for QA..')
        await web1.chdir(DEST)
        await web1.exec(`php gpanel/bin/cmd.php activate-qa-users --minutes=${deployer.params.minutes} --role=${deployer.params.role}`)
        await chat.notify('GPanel access granted for 15 minutes')
    })
