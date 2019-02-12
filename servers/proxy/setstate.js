#!/usr/bin/env node
'use strict';

const Program = require('dopamine-toolbox').Program
const cfg = require('configurator')
const SSHClient = require('dopamine-toolbox').SSHClient

let program = new Program({chat: cfg.chat.rooms.devops, smartForce: true })

program
    .description('Switch proxy state [in/active] for operator[s]')
    .option('-o, --operators <list|all>', `Comma-separated list of operators`, {choices: Object.keys(cfg.operators), required: true})
    .option('-s, --state <string>','Desired state for this operator [active,inactive]',{choices:['active','inactive'],required:true})
    .option('--filter-by-location <name>', 'Filter operators by location name', {choices: Object.keys(cfg.locations)})
    .parse()

if(program.params.filterByLocation){
    program.params.operators = program.params.operators.split(',').filter(o => cfg.operators[o].location === program.params.filterByLocation).join(',')
    console.log('Affected operators:', program.params.operators)
}

program.iterate('operators', async (operator) => {

        const   location = cfg.getLocationByOperator(operator).name,
            opDir = '/home/dopamine/production/' + cfg.operators[operator].dir,
            web = cfg.locations[location].hosts.webs[0],
            proxy = cfg.locations[location].hosts.proxy,
            state = program.params.state,
            stateString = (state === 'active'? `\"${proxy}\"` : 'false');

            let configFile  = `${opDir}/wallet/config/server.config.php`
            let sshWeb      = await new SSHClient().connect({host: web.ip, username: 'root'})

            await program.confirm(`Configuration for proxy requests at ${configFile} set to ${stateString}`)
            await sshWeb.exec(`sed -i '/CURLOPT_PROXY/d' ${configFile}`)
            await sshWeb.exec(`sed -i '/\\#ProxyStart/,/\\#ProxyEnd/d' ${configFile}`)
            await sshWeb.fileAppend(configFile,
                `\n#ProxyStart
foreach(Config::$endpoints as $brand=>$conf){
    Config::$endpoints[$brand]['curl']['options'][CURLOPT_PROXY] = ${stateString};
    Config::$endpoints[$brand]['curl']['options'][CURLOPT_USERAGENT] = "redtiger/${operator}/$brand";
}\n#ProxyEnd`)

            await sshWeb.chdir(opDir)
            await sshWeb.exec(`/home/dopamine/bin/webs-sync ${opDir}`)
            await sshWeb.disconnect()
    })
