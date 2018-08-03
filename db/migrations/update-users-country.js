#!/usr/bin/env node
'use strict';

// Migrations:

// 0. Analyze
const SQL_ANALYZE = `
    select count(*) as expected from users where (country is NULL or country = '--')
`
// 1. Select values (saves slaves query execution)
const SQL_SELECT = `
    select
        id,
        (SELECT if(countryCode = '--', 'XX', countryCode) FROM ipguard_ranges WHERE ipTo >= u.ip LIMIT 1) as country
    from users u
    where id > ? and (country is NULL or country = '--')
    order by id asc limit 1
`
// 2. Update data
const SQL_UPDATE = `
    UPDATE users SET country = ? WHERE (country is NULL or country = '--') AND id = ?;
`


const Program = require('dopamine-toolbox').Program
const cfg = require('configurator')


let program = new Program({ chat: cfg.chat.rooms.devops })

program
    .description(`Update users country using ip geolocation. This is very expensive migrations, that's why is executed in loop user by user`)
    .option('-o, --operators <name>', 'The target operator name', { required: true, choices: Object.keys(cfg.operators) })

    .iterate('operators', async (operator) => {
        const LOCATION = cfg.operators[operator].location
        
        let hosts = cfg.locations[LOCATION].hosts
        let master = await program.mysql({user: 'root', ssh: {user: 'root', host: hosts.mysql}})
        let DB = cfg.operators[operator].dbPrefix + 'platform'
        await master.query(`USE ${DB};`)
        
        
        // Analyze
        console.log(`Analyzing ${DB}`)
        let [row] = await master.query(SQL_ANALYZE)
        let expected = parseInt(row.expected)
        console.log(`Found ${expected} users without country`)
    
        
        // Select & update
        let lastId = 0
        let i = 0
        while(true) {
            let [row] = await master.query(SQL_SELECT, [lastId])
            if(!row) break
            let {id, country} = row
            if(!country || !id) throw Error(`Unexpected values` + {id, country})
            
            let res = await master.query(SQL_UPDATE, [country, id])
            console.log(`${++i}/${expected}: Update user #${id} to ${country} (${res.info})`)
            lastId = id
            
            if(i === 10 || i === 1000 || i % 10000 === 0) program.chat.notify(`${operator} | Updated ${i}/${expected} users`)
        }
        
    })