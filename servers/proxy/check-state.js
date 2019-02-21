#!/usr/bin/env node
'use strict';

const Program = require('dopamine-toolbox').Program
const cfg = require('configurator')
const SSHClient = require('dopamine-toolbox').SSHClient

let program = new Program()

program
    .description('Check proxy states by location')
    .option('-l, --locations <list|all>', `Comma-separated list of Locations`, {choices: Object.keys(cfg.locations), required: true})
    .iterate('locations', async (location) => {
        let web = cfg.locations[location].hosts.webs[0],
            operators = Object.values(cfg.operators).filter(o => o.location === location ).map(o => o.dir)
        let sshWeb      = await new SSHClient().connect({host: web.ip, username: 'root'})
        for(let operator of operators){
            console.log(
                operator.padEnd(20,' ') + ' : ' + await sshWeb.exec(`grep CURLOPT_PROXY /home/dopamine/production/${operator}/wallet/config/server.config.php || echo "Not found"`,{silent:true})
            )
        }
        sshWeb.disconnect()
    })
