#!/usr/bin/env node
'use strict';

/**
 * Usage:
 * $ node bin/vm-setup/known-hosts --hosts *-web*
 */


const Program = require('dopamine-toolbox').Program
const cfg = require('configurator')
let program = new Program({ chat: cfg.chat.rooms.devops })


program
    .option('-h, --hosts <list|all>', 'The target host names', { choices: Object.keys(cfg.hosts), required: true })
    .loop('hosts')

    .run(async (host) => {
        let ssh = await program.ssh(cfg.getHost(host).ip, 'root')

        console.log(`Adding gitlab.dopamine.bg to root user`)
        await ssh.exec(`
            ssh-keygen -f ~/.ssh/known_hosts -R gitlab.dopamine.bg
            ssh-keygen -f ~/.ssh/known_hosts -R 192.168.100.13
            ssh-keygen -f ~/.ssh/known_hosts -R 192.168.110.13
            ssh-keyscan -H gitlab.dopamine.bg >> ~/.ssh/known_hosts
        `)

        
        let user = 'dopamine'
        let file = `/home/${user}/.ssh/known_hosts`
        if(await ssh.exists(file)) {
            console.log(`Adding gitlab.dopamine.bg to ${user} user`)
            await ssh.exec(`
                ssh-keygen -f ${file} -R gitlab.dopamine.bg
                ssh-keygen -f ${file} -R 192.168.100.13
                ssh-keygen -f ${file} -R 192.168.110.13
                ssh-keyscan -H gitlab.dopamine.bg >> ${file}
                chown ${user}:${user} ${file}
            `)
        }
        
        ssh.disconnect()
    })

