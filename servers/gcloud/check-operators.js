#!/usr/bin/env node
'use strict';


const Program = require('dopamine-toolbox').Program
const Shell = require('dopamine-toolbox').Shell
const SSHClient = require('dopamine-toolbox').SSHClient
const MySQL = require('dopamine-toolbox').MySQL
const Tester = require('dopamine-toolbox').Tester
const cfg = require('configurator')


let program = new Program()

program
    .option('-l, --locations <name>', 'The target location name', {choices: Object.keys(cfg.locations), required: true})

    .iterate('locations', async (location) => {
        const verbose = program.params.verbose ? '--verbose' : ''
        const OPERATORS = Object.values(cfg.operators).filter(o => o.location === location)
        
        
        let shell = new Shell()
        let web1 = await new SSHClient().connect({host: cfg.locations[location].hosts.web1, username: 'dopamine'})
    
    
        await shell.exec(`node deploy/cayetano/check --no-chat -l ${location} ${verbose}`)
        await shell.exec(`node deploy/env/check --no-chat -p 10 -o ${OPERATORS.map(o => o.name)} ${verbose}`)
        await shell.exec(`node deploy/hermes/check --no-chat -p 10 -o ${OPERATORS.map(o => o.name)} ${verbose}`)
        
        for(let operator of OPERATORS){
    
            console.log(`\n\n# Checking ${operator.name}:`)
    
            let master = await new SSHClient().connect({host: cfg.databases[operator.databases].master, username: 'root'})
            let db = await new MySQL().connect({user: 'root'}, master)
    
            // Checkers
            let tester = new Tester()
            let it = tester.it
    
            it('should have platform commands list', async () => await web1.exec(`php production/${operator.dir}/platform/bin/cmd.php list`, {silent: true}))
            it('should have up to date transactions', async () => {
                let rows = await db.query(`select * from (SELECT createdAt FROM ${operator.dbPrefix}platform.transactions_round_instance ORDER BY id DESC LIMIT 1) tmp where createdAt > NOW() - INTERVAL 10 MINUTE`)
                if(!rows.length) throw Error('No transactions rounds from last 10 minutes!')
                console.log(rows)
            })
            
    
            
            await tester.run(false)
            
            await db.disconnect()
            await master.disconnect()
        }
    
        
        await web1.disconnect()
    })
