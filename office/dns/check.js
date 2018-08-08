#!/usr/bin/env node
'use strict';

const Program = require('dopamine-toolbox').Program
const cfg = require('configurator')
const promisify = require('util').promisify
const lookup = promisify(require('dns').lookup)

let program = new Program({chat: cfg.chat.rooms.devops})

program
    .description('Check are all host names resolved from current machine')
    .run(async () => {
        let tester = program.tester()
        let it = tester.it
    
        for(let host of Object.keys(cfg.hosts).sort()){
            let domain = `${host}.out`
            it(`resolve ${domain}`, async () => await lookup(domain))
        }
    
        await tester.run(false)
    })

