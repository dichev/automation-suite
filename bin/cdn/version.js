#!/usr/bin/env node
'use strict';

/**
 * Usage:
 * $ node bin/cdn/version --hosts all --mode blue
 */

const Program = require('dopamine-toolbox').Program
const installed = require('./.installed')
const cfg = require('configurator')


let program = new Program()

program
    .description('Checking current release version of games cdn')
    .option('-h, --hosts <list|all>', `Comma-separated list of cdn regions`, {choices: installed.hosts, required: true})
    .option('-m, --mode <blue|green>', `Which cdn to by checked. By default will check both`, {choices: ['blue', 'green']})
    .loop('hosts')
    
    .run(async (host) => {
        const modes = program.params.mode ? [program.params.mode] : ['blue', 'green']
        
        let cdn = await program.ssh(cfg.getHost(host).ip, 'dopamine')
        for(let mode of modes) {
            await cdn.chdir(`/home/dopamine/cdn/repos/${mode}`)
            await cdn.exec(`echo $(git describe --tags) ${mode}`)
        }
    })
