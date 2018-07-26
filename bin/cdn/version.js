#!/usr/bin/env node
'use strict';

/**
 * Usage:
 * $ node bin/cdn/version --hosts all --mode blue --green
 */

const Program = require('dopamine-toolbox').Program
const installed = require('./.installed')
const cfg = require('configurator')


let program = new Program()

program
    .description('Checking current release version of games cdn')
    .option('-h, --hosts <list|all>', `Comma-separated list of cdn regions. Available: ${installed.hosts}`, {choices: installed.hosts})
    .option('-m, --mode <blue|green>', `Which cdn to by updated`, {choices: ['blue', 'green']})
    .loop('hosts')
    
    .run(async (host) => {
        const MODE = program.params.mode
        
        let cdn = await program.ssh(cfg.getHost(host).ip, 'dopamine')
        await cdn.chdir(`/home/dopamine/cdn/repos/${MODE}`)
        await cdn.exec(`echo $(git describe --tags) ${MODE}`)
    })
