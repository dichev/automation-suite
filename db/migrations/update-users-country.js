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
    order by id asc limit ?
`
// 2. Update data
// const SQL_UPDATE = `
//     UPDATE users SET country = ? WHERE id = ?;
// `


const Program = require('dopamine-toolbox').Program
const cfg = require('configurator')


let program = new Program({ chat: cfg.chat.rooms.devops })

program
    .description(`Update users country using ip geolocation. This is very expensive migration, that's why is executed in a loop user by user`)
    .option('-o, --operators <name>', 'The target operator name', { required: true, choices: Object.keys(cfg.operators) })
    .option('--chunk-size <int>', 'How many user to be calculated together', { def: 20 })

    .iterate('operators', async (operator) => {
        const CHUNK_SIZE = parseInt(program.params.chunkSize) || 10
        
        let dbs = cfg.databases[cfg.operators[operator].databases]
        let master = await program.mysql({user: 'root', ssh: {user: 'root', host: dbs.master}})
        let DB = cfg.operators[operator].dbPrefix + 'platform'
        await master.query(`USE ${DB};`)
    
        master.highLoadProtection({connections: 300})
        
        // Analyze
        console.log(`Analyzing ${DB}`)
        let [row] = await master.query(SQL_ANALYZE)
        let expected = parseInt(row.expected)
        console.log(`Found ${expected} users without country`)
        
        
        // Select & update
        let lastId = 0
        let i = 0
        while(true) {
            let rows = await master.query(SQL_SELECT, [lastId, CHUNK_SIZE])
            if(!rows.length) break
    
            let sqlUpdate = ''
            for(let row of rows) {
                let {id, country} = row
                if (!country || !id) throw Error(`Unexpected values` + {id, country})
                
                sqlUpdate += `UPDATE users SET country = '${country}' WHERE id = ${id};\n`
                lastId = id
                ++i
            }
            if(!sqlUpdate) throw Error('Something is wrong, check here')
            // console.log(sqlUpdate)
            let res = await master.query(sqlUpdate)
            console.log(`${operator} | ${i} / ${expected}: Updated users #${rows[0].id}..#${rows[rows.length-1].id}`)
    
    
            if(i === 10 || i % 1000 === 0) program.chat.notify(`${operator} | Updated ${i} / ${expected} users`)
        }
        
    })