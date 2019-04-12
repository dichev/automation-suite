#!/usr/bin/env node
'use strict';

const Program = require('dopamine-toolbox').Program
const Input = require('dopamine-toolbox').Input
const SSHClient = require('dopamine-toolbox').SSHClient
const MySQL = require('dopamine-toolbox').MySQL
const cfg = require('configurator')

const DB_HOSTS = Object.keys(cfg.hosts).filter(h => h.startsWith('sofia-replication'))

let program = new Program()

program
    .description('Fetch anything from any replication')
    .option('-q, --query <sql>', 'Read-only SQL query')
    .option('-h, --hosts <name|all>', 'The target database instances', { required: true, choices: DB_HOSTS })
    .parse()


Promise.resolve().then(async () => {
    
    console.log('Selected hosts:\n ' + program.params.hosts.split(',').join('\n ') + '\n')
    
    let query = ''
    if (program.params.query) {
        query = program.params.query
    } else {
        console.log(`Enter query:`)
        let input = new Input({collectHistoryFile: __dirname + '/.history'})
        query = await input.ask('>') || 'SELECT NOW();'
    }
    
    
    await program.iterate('hosts', async (host) => {
        let ssh = new SSHClient()
        await ssh.connect({ host: cfg.hosts[host].ip,  username: 'dopamine' })
        
        let ronly = cfg.access.mysql.readOnly
        let db = new MySQL()
        await db.connect({user: ronly.user, password: ronly.password}, ssh)

        try {
            let rows = await db.query(query)
            console.log(JSON.stringify(rows, null, 2))
        } catch (e) {
            console.warn(e.toString())
        }
        
        await db.disconnect()
        await ssh.disconnect()
    })
    
})