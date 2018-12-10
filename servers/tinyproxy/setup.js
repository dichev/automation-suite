#!/usr/bin/env node
'use strict';

const Program = require('dopamine-toolbox').Program
const cfg = require('configurator')
const SSHClient = require('dopamine-toolbox').SSHClient

//let program = new Program({chat: cfg.chat.rooms.deployBackend})
let program = new Program({chat: ''})
let fileExistsRemote = async function(file,ssh){
    return (await ssh.exec(`if [  -f ${file} ]; then echo "yes"; else echo "no"; fi`,{silent:true}) === 'yes')
}

let packageExistsRemote = async function(pack,ssh){
    return (await ssh.exec(`dpkg -l | grep ${pack} | wc -l`,{silent:true}) > '0')
}


program
    .description('Tiny proxy setup.')
    .option('-l, --locations <list|all>', 'Location', {choices: Object.keys(cfg.locations), required: true})
    .iterate('locations', async (location) => {
        let lb = cfg.locations[location].hosts.lb
        let sshLb = await new SSHClient().connect({host: lb, username: 'root'})
        let existsPkgLb = await packageExistsRemote('tinyproxy',sshLb)
        let existsCfgDope = await fileExistsRemote('/opt/servers-conf/proxy/tinyproxy.conf',sshLb)

        if(!existsPkgLb){
            if(!existsCfgDope) throw(`Proxy config not available from local repo for `
                                    +`servers-conf-${location}`
                                    +`\nPlease deploy configuration with proxy/tinyproxy.conf file`
                                    +`\nexample-deploy$ node servers/servers-conf/update -l ${location}`)

/** Not needed: Here just for example: Config deployment should be taking place using -> node servers/servers-conf/update
             await sshLb.chdir('/opt/servers-conf')
             await sshLb.chdir('git pull')
**/
//            await sshLb.exec('apt-get install -y tinyproxy')
//            await sshLb.exec('rm /etc/tinyproxy/tinyproxy.conf && ln -s /opt/servers-conf/proxy/tinyproxy.conf /etc/tinyproxy/tinyproxy.conf')
//            await sshLb.exec('/etc/init.d/tinyproxy restart')

        }else{
            throw('Tinyproxy is already set up!')
        }
        console.log(existsPkgLb)
        await sshLb.disconnect()
    })