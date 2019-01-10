#!/usr/bin/env node
'use strict';

const Program = require('dopamine-toolbox').Program
const cfg = require('configurator')
const SSHClient = require('dopamine-toolbox').SSHClient
const proxyPort = 3128

let program = new Program({chat: cfg.chat.rooms.devops})

program
    .description('Switch proxy state [in/active] for operator[s]')
    .option('-o, --operators <list|all>', `Comma-separated list of operators`, {choices: Object.keys(cfg.operators), required: true})
    .option('-s, --state <string>','Desired state for this operator [active,inactive]',{choices:['active','inactive'],required:true})
    .iterate('operators', async (operator) => {

        const   location = cfg.getLocationByOperator(operator).name,
            opDir = '/home/dopamine/production/' + cfg.operators[operator].dir,
            web = cfg.locations[location].hosts.webs[0],
            lb = cfg.locations[location].hosts.lb,
            state = program.params.state,
            stateString = (state === 'active'? `\\"${lb}:${proxyPort}\\"` : 'false');

            let configFile  = `${opDir}/wallet/config/server.config.php`
            let sshWeb      = await new SSHClient().connect({host: web.ip, username: 'root'})
            let proxyCnf    = await sshWeb.findInFile(configFile,'CURLOPT_PROXY')

            if(proxyCnf.length === 0){
                /** NO proxy configuration found in file. Add proxy config with state 'false' **/
                await program.ask(`Not configured for proxy requests at ${configFile}.\nAdd configuration?`)
                await sshWeb.fileAppend(configFile,
                    `\n\nforeach(Config::$endpoints as $brand=>$conf) Config::$endpoints[$brand]['curl']['options'][CURLOPT_PROXY] = null;\n\n`)
            }

            /** Change state to: **/
            await program.ask(`Proxy configuration found!\nChanging to ${stateString}`)
            await sshWeb.exec(`sed -i -e "s/CURLOPT_PROXY] = .*;/CURLOPT_PROXY] = ${stateString};/g" ${configFile}`)
            await sshWeb.chdir(opDir)
            await sshWeb.exec(`/home/dopamine/bin/webs-sync ${opDir}`)
            await sshWeb.disconnect()
    })
