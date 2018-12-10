#!/usr/bin/env node
'use strict';

const Program = require('dopamine-toolbox').Program
const cfg = require('configurator')
const SSHClient = require('dopamine-toolbox').SSHClient
const tpl = `foreach(Config::$endpoints as $brand=>$conf) Config::$endpoints[$brand]['curl']['options'][CURLOPT_PROXY] = '{{proxy}}';`

//let program = new Program({chat: cfg.chat.rooms.deployBackend})
let program = new Program({chat: ''})

let template = function(tplVars,tpl){
    for(let key in tplVars) tpl = tpl.split(`{{${key}}}`).join(tplVars[key])
    return tpl;
}

let fileExistsRemote = async function(file,ssh){
    return (await ssh.exec(`if [  -f ${file} ]; then echo "yes"; else echo "no"; fi`,{silent:true}) === 'yes')
}

let packageExistsRemote = async function(pack,ssh){
    return (await ssh.exec(`dpkg -l | grep ${pack} | wc -l`,{silent:true}) > '0')
}

program
    .description('Allow QA access to gpanel')
    .option('-o, --operators <list|all>', `Comma-separated list of operators`, {choices: Object.keys(cfg.operators), required: true})
    .iterate('operators', async (operator) => {

        const   location = cfg.getLocationByOperator(operator).name,
                cfgOperator = cfg.operators[operator],
                web = cfg.locations[location].hosts.webs[0],
                lb = cfg.locations[location].hosts.lb;

        let sshLb   = await new SSHClient().connect({host: lb, username: 'root'})
        let existsPkgLb = await packageExistsRemote('tinyproxy',sshLb)
        let existsCfg  = await fileExistsRemote('/etc/tinyproxy/tinyproxy.conf',sshLb)
        let existsCfgDope = await fileExistsRemote('/opt/servers-conf/proxy/tinyproxy.conf',sshLb)
        if(existsCfg && existsCfgDope && existsPkgLb){
            console.log("TinyProxy config found! Setting up operator.")
            let sshWeb  = await new SSHClient().connect({host: web.ip, username: 'root'})
            let content = await sshWeb.exec(`cat /home/dopamine/production/${cfgOperator.dir}/wallet/config/server.config.php`,{silent:true}),
                newContent = template({proxy:lb},tpl);
            console.log(newContent);
            await sshWeb.disconnect()
        }else{
            console.log(`TinyProxy Does not exists or is not configured properly!`
                        +`\nexistsPkgLb:${existsPkgLb}`
                        +`\nexistsCfg:${existsCfg}`
                        +`\nexistsCfgDope:${existsCfgDope}\n`)
        }
        await sshLb.disconnect()
})
