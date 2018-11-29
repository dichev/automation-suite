#!/usr/bin/env node
'use strict';

const Program = require('dopamine-toolbox').Program
const SSHClient = require('dopamine-toolbox').SSHClient
const Tester = require('dopamine-toolbox').Tester
const cfg = require('configurator')

let program = new Program({chat: cfg.chat.rooms.devops})


program
    .description('Check cayetano docker swarm')
    .option('-l, --locations <list|all>', 'The target host name', {choices: Object.keys(cfg.locations), required: true})

    .iterate('locations', async (location) => {
        
        let tester = new Tester()
        let it = tester.it
        
        let webs = []
        for(let host of cfg.locations[location].hosts.webs){
            let ssh = await new SSHClient().connect({host: host.ip, username: 'dopamine'})
            webs.push({name: host.name, ssh: ssh})
        }
        
        for(let {name, ssh} of webs) {
            it(`[${name}] has heartbeat`, async () => {
                await ssh.exec(`curl --fail -sS http://127.0.0.1:900/math/heartbeat`)
            })
            it(`[${name}] proceed settings request`, async () => {
                await ssh.exec(`curl --fail -sS -X POST http://127.0.0.1:900/math/slot/classicfruit/settings -H 'content-type: application/json' -d '{}'`, {silent: true})
            })
            it(`[${name}] proceed spin request`, async () => {
                await ssh.exec(`curl --fail -sS -X POST http://127.0.0.1:900/math/slot/classicfruit/spin -H 'content-type: application/json' -d '{"stake": "1.00"}'`, {silent: true})
            })
            it(`[${name}] does NOT proceed gaff request`, async () => {
                await ssh.exec(`curl --fail -sS -X POST http://127.0.0.1:900/math/gaff/slot/classicfruit/spin -H 'content-type: application/json' -d '{"stake": "1.00", "gaff": {"scenario": "[15,13,19,12,0]" }}' || exit 0 && exit 1`, {silent: true})
            })
        }
        
        await tester.run()
    
        for (let web of webs) await web.ssh.disconnect()
    })

