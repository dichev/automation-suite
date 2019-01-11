#!/usr/bin/env node
'use strict';

const Program = require('dopamine-toolbox').Program
const cfg = require('configurator')


let program = new Program({ chat: cfg.chat.rooms.devops })

program
    .option('-o, --operators <name>', 'The target operator name', { required: true, choices: Object.keys(cfg.operators) })
    .option('--chunk-size <int>', 'How many user to be calculated together', { def: 20 })

    .iterate('operators', async (operator) => {
        const CHUNK_SIZE = parseInt(program.params.chunkSize) || 100
        
        let dbs = cfg.databases[cfg.operators[operator].databases]
        let master = await program.mysql({user: 'root', ssh: {user: 'root', host: dbs.master}})
        let DB = cfg.operators[operator].dbPrefix + 'platform'
        await master.query(`USE ${DB};`)
    
        master.highLoadProtection({connections: 300})
        
        // Analyze
        console.log(`Analyzing ${DB}`)
        let [row] = await master.query(`SELECT MIN(id) as min, MAX(id) as max, COUNT(id) as total FROM notifications WHERE gameConfigId = 0`)
        let total = parseInt(row.total)
        let min = parseInt(row.min)
        let max = parseInt(row.max)
        program.chat.message(`Found ${total} rows `)
        
        
        let SQL = `UPDATE notifications n SET gameConfigId = IFNULL((
    SELECT id FROM games_configuration gc
    WHERE gameId = n.gameId AND brandId IN ((SELECT brandId FROM users WHERE id = n.userId), 0) ORDER BY brandId DESC LIMIT 1
), 0) WHERE gameConfigId = 0 and id between ? and ?;`
    
        for (let i = min; i <= max; i += CHUNK_SIZE) {
            program.chat.message(`update rows between ${i}..${i+CHUNK_SIZE}`)
            await master.query(SQL, [i, i + CHUNK_SIZE])
            // await program.sleep(1)
        }
        program.chat.message(`update rows between > ${max}`)
        await master.query(`UPDATE notifications n SET gameConfigId = IFNULL((
    SELECT id FROM games_configuration gc
    WHERE gameId = n.gameId AND brandId IN ((SELECT brandId FROM users WHERE id = n.userId), 0) ORDER BY brandId DESC LIMIT 1
), 0) WHERE gameConfigId = 0  and id >= ?`, [max])
        
    })