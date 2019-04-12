#!/usr/bin/env node
'use strict';

const Program = require('dopamine-toolbox').Program
const Shell = require('dopamine-toolbox').Shell
const SSHClient = require('dopamine-toolbox').SSHClient
const MySQL = require('dopamine-toolbox').MySQL
const dump = require('dopamine-toolbox').MySQLDumper.dump

const diff = require('diff')
const fs = require('fs')
const path = require('path')
const cfg = require('configurator')
const colors = require('chalk')

const DEST = path.resolve(__dirname + '/../../.tmp/diff-schema').replace(/\\/g, '/')
const DATABASES = ['platform', 'demo', 'panel', 'jackpot', 'stats', 'segments', 'tournaments', 'bonus', 'archive']


let program = new Program()
program
    .description('Compare database schemas of the operators')
    .option('-o, --operators <name>', 'The target operator name', { required: true, choices: Object.keys(cfg.operators) })
    .option('--base <operator>', 'The operator which database will be used as base for the comparison. By default will be used the first one from the --operators list')
    .option('--db <list>', 'List of database types to be validated. By default will check them all', { choices: DATABASES })
    .parse()


if(program.params.base && !program.params.operators.split(',').includes(program.params.base)) {
    throw Error(`The base operator (${program.params.base}) must be include in the operators list (${program.params.operators})`)
}
let baseOperator = program.params.base || program.params.operators.split(',')[0]


program.run(async () => {
    if (!fs.existsSync(DEST)) {
        console.log(`creating folder ${DEST}`)
        await new Shell().exec(`mkdir -pv ${DEST}`)
    }
})

// Dump database schemas
.then(async () => program.iterate('operators', async (operator) => {
    let dbs = cfg.databases[cfg.operators[operator].databases]
    let ronly = cfg.access.mysql.readOnly

    let isSharedJackpotDb = program.params.db === 'jackpot' && cfg.operators[operator].sharedJackpot
    let masterHost = isSharedJackpotDb ? dbs.backups.jackpots : dbs.backups.master

    let sshMaster = await new SSHClient().connect({host: masterHost, username: 'dopamine'})
    let dbMaster = await new MySQL().connect({user: ronly.user, password: ronly.password}, sshMaster)
    
    let sshArchive = await new SSHClient().connect({host: dbs.backups.archive, username: 'dopamine'})
    let dbArchive = await new MySQL().connect({user: ronly.user, password: ronly.password}, sshArchive)

    let databases = program.params.db ? program.params.db.split(',') : DATABASES
    for (let dbType of databases) {
        let db = dbType === 'archive' ? dbArchive : dbMaster
        let dbname = cfg.getOperatorDatabaseName(operator, dbType)
        console.warn(`\nDumping ${dbname}..`)
        await db.query(`USE ${dbname};`)
        
        await dump({
            connection: db.getConnection(),
            
            excludeTables: [
                '__sync_users_bet_limits_default_prev',
                '__sync_users_bet_limits_default_next',
                // 'games_configuration_view',
                'bonus_usage_report_archive', // TMP due permission error
                'view_rtp_monthly' // TMP due permission error
            ],
            dest: DEST + '/' + dbname + '.sql',
            modifiers: [
                (output) => output.replace(/ AUTO_INCREMENT=\d+/g, ''),
                (output) => output.replace(/ DEFINER=`.+`/g, ''),
                (output) => output.replace(/ SQL SECURITY INVOKER/g, ''),
                (output) => output.replace(/\(PARTITION [\s\S]+ ENGINE = InnoDB\) /g, ' --- list of available partitions ---\n'),
            ],
            sortKeys: true,
            exportData: false // be careful with this option on mirrors
        })
        
    }
    
    await Promise.all([dbMaster, dbArchive, sshMaster, sshArchive].map(async conn => await conn.disconnect()))
}))

// Disable parallelism here to ensure readability fo the diffs report bellow
.then(() => {
    program.params.parallel = undefined
})


// Diff all database schema files
.then(async() => program.iterate('operators', async (operator) => {
    if(operator === baseOperator) return // not necessary to compare him against himself
    
    // console.log(`\n\n################### DIFF ${operator} vs ${baseOperator} ###################`)
    
    let databases = program.params.db ? program.params.db.split(',') : DATABASES
    for (let dbType of databases) {
        const BASE = cfg.getOperatorDatabaseName(baseOperator, dbType) + '.sql'
        const TARGET = cfg.getOperatorDatabaseName(operator, dbType) + '.sql'
        
        let base   = fs.readFileSync(DEST + '/' + BASE, 'utf8');
        let target = fs.readFileSync(DEST + '/' + TARGET, 'utf8');
        
        let diffs = diff.diffLines(target, base);
        
        let totalDiffs = 0
        let found = false
        
        diffs.forEach((part, i) => {
            // green for additions, red for deletions, grey for common parts
            let color = part.added ? 'green' : part.removed ? 'red' : 'grey';
            if (part.added || part.removed) {
                if(!found) {
                    console.log(`# Compare ${TARGET} against ${BASE}..`)
                    found = true
                }
                totalDiffs += part.count
                if (part.added) {
                    console.info(colors.green(part.value.trim().replace(/^/mg, '+')));
                } else {
                    console.info(colors.red(part.value.trim().replace(/^/mg, '-')));
                }
            }
        })
        if (totalDiffs > 0) {
            console.info(`Total diffs: ${totalDiffs} lines`)
            console.info('-'.repeat(60))
        }
    }
}))
    
