#!/usr/bin/env node
'use strict';

/**
 * Usage:
 * $ node deploy/crons/execute --operators rtg --cron recon-wallet --project platform
 */

const Program = require('dopamine-toolbox').Program
const SSHClient = require('dopamine-toolbox').SSHClien
const cfg = require('configurator')

let program = new Program({chat: cfg.chat.rooms.devops})

program
.description('Execute cron for list of operators')
.option('-o, --operators <list|all>', `Comma-separated list of operators`, {choices: Object.keys(cfg.operators), required: true})
.option('-c, --cron <string>', `Cron name`, {required: true})
.option('-p, --project <string>', `Project folder name`, {required: true})

.iterate('operators', async (operator) => {
    
    const location = cfg.getLocationByOperator(operator)
    const DEST = 'production/' + cfg.operators[operator].dir

    let web1 = new SSHClient(program.params.dryRun)
    await web1.connect({host: location.hosts.web1, username: 'dopamine'})
    await web1.chdir(DEST)

    let availableCommands = await web1.exec(`php ${program.params.project}/bin/cmd.php list`)

    if (availableCommands.indexOf(program.params.cron) === -1) {
        throw Error(`Cron not found: ${program.params.cron} in project: ${program.params.project}`);
    }
    await web1.exec(`php ${program.params.project}/bin/cmd.php ${program.params.cron}`)
    await program.sleep(2, 'Waiting between iterations')
})