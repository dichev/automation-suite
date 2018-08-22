#!/usr/bin/env node
'use strict';

// Migrations:
const SQL_SELECT = `
select
    roundId,
    DATE(endTime) as pDate,
    r.userId,
    r.gameId,
    responses,
    startTime,
    endTime
from
(
    select
        history.roundId as roundId2,
        h.roundId,
        h.platformResponse as responses,
        h.startTime,
        h.endTime
        
        from transactions_history h
        left join history on (history.roundId = h.roundId)
    
        where h.roundId in (
            select roundId from (
                SELECT roundId FROM users_games_states WHERE state IS NOT NULL AND updatedAt < DATE_SUB(CURDATE(), INTERVAL 11 DAY)
                UNION SELECT roundInstanceId FROM transactions_real_recon WHERE endTime < DATE_SUB(CURDATE(), INTERVAL 12 DAY) AND statusCode IN (600,601,602)
                UNION SELECT roundInstanceId FROM transactions_real WHERE statusCode=100 AND endTime < DATE_SUB(CURDATE(), INTERVAL 12 DAY)
            ) b
        )
        
        having roundId2 is null
        
) c
left join transactions_round_instance r on (r.id = roundId)
`
const SQL_SYNC = `REPLACE INTO history ${SQL_SELECT}`

const Program = require('dopamine-toolbox').Program
const cfg = require('configurator')
let program = new Program({ chat: cfg.chat.rooms.devops })

program
    .description(`Update users country using ip geolocation. This is very expensive migration, that's why is executed in a loop user by user`)
    .option('-o, --operators <name>', 'The target operator name', { required: true, choices: Object.keys(cfg.operators) })

    .iterate('operators', async (operator) => {
        let dbs = cfg.databases[cfg.operators[operator].databases]
        let master = await program.mysql({user: 'root', ssh: {user: 'root', host: dbs.master}})
        let DB = cfg.operators[operator].dbPrefix + 'platform'
        await master.query(`USE ${DB};`)
    
        master.highLoadProtection({connections: 300})
        
        // Analyze
        console.log(`Analyzing ${DB}`)
        let rows = await master.query(SQL_SELECT)
        if(!rows.length) return console.log('no records founds')
        await program.chat.notify(`Found ${rows.length} history records for sync`)
        
        await program.confirm('Proceed?')
        await master.query(SQL_SYNC)
        await program.chat.notify('Synced')
        
    })