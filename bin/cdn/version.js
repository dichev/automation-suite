#!/usr/bin/env node
'use strict';

/**
 * Usage:
 * $ node bin/cdn/version --host all --blue --green
 */

const Program = require('dopamine-toolbox').Program
const installed = require('./.installed')
const cfg = require('configurator')


let program = new Program()

program
    .description('Checking current release version of games cdn')
    .option('-h, --hosts <list|all>', `Comma-separated list of cdn regions. Available: ${installed.hosts}`, {choices: installed.hosts})
    .option('--blue', `Only blue repo. By default both repos will be updated`)
    .option('--green', `Only green repo. By default both repos will be updated`)
    .loop('hosts')
    
    .run(async (host) => {
        let blue = program.params.blue
        let green = program.params.green
        if(!blue && !green) blue = green = true
        
        let ssh = await program.ssh(cfg.getHost(host).ip, 'dopamine')
        
        if(blue) {
            await ssh.chdir(`/home/dopamine/cdn/repos/blue`)
            await ssh.exec(`echo $(git describe --tags) blue`)
        }

        if(green){
            await ssh.chdir(`/home/dopamine/cdn/repos/green`)
            await ssh.exec(`echo $(git describe --tags) green`)
        }
    })
