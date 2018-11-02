#!/usr/bin/env node
'use strict';


const Program = require('dopamine-toolbox').Program
const SSHClient = require('dopamine-toolbox').SSHClient
const Input = require('dopamine-toolbox').Input
const cfg = require('configurator')
const fs = require('fs')

let program = new Program()

program
    .description('Execute any command on over the base directory of any operator')
    .option('-o, --operators <list|all>', `Comma-separated list of operators`, {choices: Object.keys(cfg.operators), required: true})
    .option('-e, --exec <cmd>', 'Command to be executed')
    .option('-E, --exec-file <file>', 'Read remote commands from file')
    .parse()

if (program.params.exec && program.params.execFile) {
    console.warn(`! Please set only one of these: --exec or --exec-file`)
    process.exit(1)
}


Promise.resolve().then(async () => {
    program.params.force = true
    console.log('Executing over:\n ' + program.params.operators.split(',').join('\n '))
    
    let cmd = ''
    if(program.params.exec) {
        cmd = program.params.exec
    } else if(program.params.execFile){
        cmd = fs.readFileSync(program.params.execFile, 'utf8').replace(/\r?\n/g, '\n')
    } else {
        console.log('Enter command:')
        let input = new Input({collectHistoryFile: __dirname + '/.history'})
        cmd = await input.ask('>') || 'echo Hello $HOSTNAME!'
    }

    program.iterate('operators', async (operator) => {
        let ssh = await new SSHClient().connect({host: cfg.getLocationByOperator(operator).hosts.web1, username: 'dopamine'})
        await ssh.chdir('/home/dopamine/production/' + cfg.operators[operator].dir)
        await ssh.exec(cmd)
        await ssh.disconnect()
    })
  
})

    


