#!/usr/bin/env node
'use strict';

/**
 * Usage:
 * $ node deploy/cdn/version --hosts all --mode blue
 */

const Program = require('dopamine-toolbox').Program
const SSHClient = require('dopamine-toolbox').SSHClient
const cfg = require('configurator')
const HOSTS = Object.values(cfg.hosts).filter(h => h.type === 'cdn').map(h => h.name)


let program = new Program()

program
    .description('Checking current release version of games cdn')
    .option('-h, --hosts <list|all>', `Comma-separated list of cdn regions`, {choices: HOSTS, required: true})
    .option('-m, --mode <blue|green>', `Which cdn to by checked. By default will check both`, {choices: ['blue', 'green']})
    
    .iterate('hosts', async (host) => {
        const modes = program.params.mode ? [program.params.mode] : ['blue', 'green']
        
        let cdn = new SSHClient()
        await cdn.connect({host: cfg.getHost(host).ip, username: 'dopamine'})
        for(let mode of modes) {
            await cdn.chdir(`/home/dopamine/cdn/repos/${mode}`)
            await cdn.exec(`echo $(git describe --tags) ${mode}`)
        }
        await cdn.disconnect()
    })
