#!/usr/bin/env node
'use strict';

const Program = require('dopamine-toolbox').Program
const SSHClient = require('dopamine-toolbox').SSHClient
const Input = require('dopamine-toolbox').Input
const cfg = require('configurator')
let program = new Program()


program
    .description('List current ssh keys of multiple hosts')
    .option('-h, --hosts <list|all>', 'The target host names', { choices: Object.keys(cfg.hosts), required: true })
    .option('-u, --user <dopamine|root|all>', 'Check the keys of these users', { choices: ['dozpamine', 'root'], def: 'all'})
    .parse()
    

program.iterate('hosts', async (host) => {
    let ssh = await new SSHClient().connect({host: cfg.getHost(host).ip, username: 'root'})
    
    for(let user of program.params.user.split(',')){
        const FILE = user === 'root' ? '/root/.ssh/authorized_keys' : `/home/${user}/.ssh/authorized_keys`
        console.log(`\nList ${user} ssh keys (${FILE}):`)
        if(!await ssh.exists(FILE)) {
            console.log('No such user..')
            continue
        }
        let keys = await ssh.readFile(FILE)
        console.log(keys.split('\n').filter(line => line.trim() !== '').map(line => line.trim().replace(/ssh-rsa +(.{50}).+ (.+)/, '$1 $2')).join('\n'))
    }
    
    await ssh.disconnect()
})
