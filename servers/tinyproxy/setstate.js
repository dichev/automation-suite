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

let fileAppendRemote = async function(file,content,ssh){
    return await ssh.exec("echo '" + Buffer.from(content).toString('base64') + "' | base64 -d >> " + file)
}

let findInFileRemote = async function (file,needle,ssh){
    try{ // Exit status is 1 [error] when nothing is found!
        return (await ssh.exec(`cat  ${file} | grep ${needle}`,{silent:true})).split("\n")
    }catch(e){
        return []
    }
}


program
    .description('Allow QA access to gpanel')
    .option('-o, --operators <list|all>', `Comma-separated list of operators`, {choices: Object.keys(cfg.operators), required: true})
    .option('-s, --state <string>','State to be activated [active,inactive]',{choices:['active','inactive'],required:true})
    .iterate('operators', async (operator) => {

        const   location = cfg.getLocationByOperator(operator).name,
                cfgOperator = cfg.operators[operator],
                web = cfg.locations[location].hosts.webs[0],
                lb = cfg.locations[location].hosts.lb,
                state = program.params.state,
                stateString = (state === 'active'? `\\"${lb}\\"` : 'false');

        let sshLb           = await new SSHClient().connect({host: lb, username: 'root'})
        let existsPkgLb     = await packageExistsRemote('tinyproxy',sshLb)
        let existsCfg       = await fileExistsRemote('/etc/tinyproxy/tinyproxy.conf',sshLb)
        let existsCfgDope   = await fileExistsRemote('/opt/servers-conf/proxy/tinyproxy.conf',sshLb)
        await sshLb.disconnect()

        if(existsCfg && existsCfgDope && existsPkgLb){

            console.log(`TinyProxy config found! Setting up operator: ${operator}`)
//            let configFile  = `/home/dopamine/production/${cfgOperator.dir}/wallet/config/server.config.php`
            let configFile  = `/home/dopamine/server.config.php`
            let sshWeb      = await new SSHClient().connect({host: web.ip, username: 'root'})
            let proxyCnf    = await findInFileRemote(configFile,'CURLOPT_PROXY',sshWeb)

            if(proxyCnf.length === 0){
                /** Add proxy config with selected state **/
                let newContent = '\n\n' + template({proxy:'false'},tpl) + '\n\n';
                await program.ask(`Not configured for proxy requests at ${configFile}.\nAdd configuration?`)
                await fileAppendRemote(configFile,newContent,sshWeb)
            }

            /** Change state to: **/
            await program.ask(`Proxy configuration found!\nChanging to ${stateString}`)
            await sshWeb.exec(`sed -i -e "s/CURLOPT_PROXY] = .*;/CURLOPT_PROXY] = ${stateString};/g" ${configFile}`)
            await sshWeb.disconnect()
        }else{
            await sshWeb.disconnect()
            throw(`TinyProxy Does not exists on lb or is not configured properly!`
                        +`\nexistsPkgLb: ${existsPkgLb}`
                        +`\nexistsCfg: ${existsCfg}`
                        +`\nexistsCfgDope: ${existsCfgDope}\n`)
        }
})
