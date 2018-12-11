#!/usr/bin/env node
'use strict';

const Program = require('dopamine-toolbox').Program
const cfg = require('configurator')
const SSHClient = require('dopamine-toolbox').SSHClient
const tpl = `foreach(Config::$endpoints as $brand=>$conf) Config::$endpoints[$brand]['curl']['options'][CURLOPT_PROXY] = '{{proxy}}';`
const proxyPort = 1080

//let program = new Program({chat: cfg.chat.rooms.deployBackend})
let program = new Program({chat: ''})

let template = function(tplVars,tpl){
    for(let key in tplVars) tpl = tpl.split(`{{${key}}}`).join(tplVars[key])
    return tpl;
}

program
    .description('Allow QA access to gpanel')
    .option('-o, --operators <list|all>', `Comma-separated list of operators`, {choices: Object.keys(cfg.operators), required: true})
    .option('-s, --state <string>','Desired state for this operator [active,inactive]',{choices:['active','inactive'],required:true})
    .iterate('operators', async (operator) => {

        const   location = cfg.getLocationByOperator(operator).name,
                cfgOperator = cfg.operators[operator],
                web = cfg.locations[location].hosts.webs[0],
                lb = cfg.locations[location].hosts.lb,
                state = program.params.state,
                stateString = (state === 'active'? `\\"${lb}:${proxyPort}\\"` : 'false');

        let sshLb           = await new SSHClient().connect({host: lb, username: 'root'})
        let existsPkgLb     = await sshLb.packageExists('tinyproxy')
        let existsCfg       = await sshLb.exists('/etc/tinyproxy/tinyproxy.conf')
        let existsCfgDope   = await sshLb.exists('/opt/servers-conf/proxy/tinyproxy.conf')
        await sshLb.disconnect()
        if(existsCfg && existsCfgDope && existsPkgLb){
            console.log(`TinyProxy config found! Setting up operator: ${operator}`)
//            let configFile  = `/home/dopamine/production/${cfgOperator.dir}/wallet/config/server.config.php`
            let configFile  = `/home/dopamine/server.config.php`
            let sshWeb      = await new SSHClient().connect({host: web.ip, username: 'root'})
            let proxyCnf    = await sshWeb.findInFile(configFile,'CURLOPT_PROXY')

            if(proxyCnf.length === 0){
                /** NO proxy configuration found in file. Add proxy config with state 'false' **/
                let newContent = '\n\n' + template({proxy:'false'},tpl) + '\n\n';
                await program.ask(`Not configured for proxy requests at ${configFile}.\nAdd configuration?`)
                await sshWeb.fileAppend(configFile,newContent)
            }

            /** Change state to: **/
            await program.ask(`Proxy configuration found!\nChanging to ${stateString}`)
            await sshWeb.exec(`sed -i -e "s/CURLOPT_PROXY] = .*;/CURLOPT_PROXY] = ${stateString};/g" ${configFile}`)
            await sshWeb.disconnect()
        }else{
            throw(`TinyProxy Does not exists on lb or is not configured properly!`
                        +`\nexistsPkgLb: ${existsPkgLb}`
                        +`\nexistsCfg: ${existsCfg}`
                        +`\nexistsCfgDope: ${existsCfgDope}\n`)
        }
})
