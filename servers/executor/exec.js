#!/usr/bin/env node
'use strict';


const Program = require('dopamine-toolbox').Program
const SSHClient = require('dopamine-toolbox').SSHClient
const Input = require('dopamine-toolbox').Input
const cfg = require('configurator')
const fs = require('fs')

let program = new Program()

program
    .description('Execute any command on any host')
    .option('-h, --hosts <list>', 'The target host names', { choices: Object.keys(cfg.hosts), required: true })
    .option('-u, --user <name>', 'Choose ssh user', { def: 'root' })
    .option('-e, --exec <cmd>', 'Command to be executed')
    .option('-E, --exec-file <file>', 'Read remote commands from file')
    .option('--no-history', 'Disable saving commands to history (useful for credentials data)')
    .parse()


const iterate = async (cmd) => {
    await program.iterate('hosts', async (host) => {
        let ssh = await new SSHClient().connect({host: cfg.getHost(host).ip, username: program.params.user})
        await ssh.exec(cmd)
        await ssh.disconnect()
    })
}


Promise.resolve().then(async () => {
    if (program.params.exec && program.params.execFile) {
        console.warn(`! Please set only one of these: --exec or --exec-file`)
        process.exit(1)
    }
    program.params.force = true
    console.log('Executing over:\n ' + program.params.hosts.split(',').join('\n '))
    
    let cmd = ''
    if(program.params.exec) {
        cmd = program.params.exec
        await iterate(cmd)
    } else if(program.params.execFile){
        cmd = fs.readFileSync(program.params.execFile, 'utf8').replace(/\r?\n/g, '\n')
        await iterate(cmd)
    } else {
        console.log('Enter command:')
        let input = new Input({collectHistoryFile: program.params.history === false ? '' : __dirname + '/.history'})
        while (true) {
            cmd = (await input.ask('>')).trim()
            if (!cmd) continue;
            if (cmd === 'exit') break;
            await iterate(cmd)
            console.log('')
        }
    }
  
})

    


