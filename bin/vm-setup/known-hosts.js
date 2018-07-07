#!/usr/bin/env node
'use strict';

/**
 * Usage:
 * $ node bin/vm-setup/known-hosts --hosts *-web*
 */


const Deployer = require('deployer2')
const cfg = require('configurator')
let deployer = new Deployer(cfg.devops)

deployer
    .option('-h, --hosts <list|all>', 'The target host names', { choices: Object.keys(cfg.hosts) })
    .loop('hosts')

    .run(async (host) => {
        if(host.includes('zeus')) return; // TODO: skip legacy hosts (they must be removed)

        let ssh = await deployer.ssh(cfg.getHost(host).ip, 'root')

        console.log(`Adding gitlab.dopamine.bg to root user`)
        await ssh.exec(`ssh-keygen -f ~/.ssh/known_hosts -R gitlab.dopamine.bg`)
        await ssh.exec(`ssh-keygen -f ~/.ssh/known_hosts -R 192.168.100.13`)
        await ssh.exec(`ssh-keygen -f ~/.ssh/known_hosts -R 192.168.110.13`)
        await ssh.exec(`ssh-keyscan -H gitlab.dopamine.bg >> ~/.ssh/known_hosts`)

        
        let user = 'dopamine'
        if (host.startsWith('pokerstars')) user = 'red' // TODO: temporary until the unification is done
        let file = `/home/${user}/.ssh/known_hosts`
        
        console.log(`Adding gitlab.dopamine.bg to ${user} user (if exists)`)
        if(await ssh.exec(`[ -f ${file} ] && echo "Found" || echo "Not found"`) === "Found") {
            await ssh.exec(`ssh-keygen -f ${file} -R gitlab.dopamine.bg`)
            await ssh.exec(`ssh-keygen -f ${file} -R 192.168.100.13`)
            await ssh.exec(`ssh-keygen -f ${file} -R 192.168.110.13`)
            await ssh.exec(`ssh-keyscan -H gitlab.dopamine.bg >> ${file}`)
            await ssh.exec(`chown ${user}:${user} ${file}`)
        }
        
        ssh.disconnect()
    })

