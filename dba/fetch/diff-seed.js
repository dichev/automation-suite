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

const DEST = path.resolve(__dirname + '/../../.tmp/diff-seed').replace(/\\/g, '/')
const DATABASES = ['platform', 'demo', 'panel', 'jackpot', 'stats', 'segments', 'tournaments', 'bonus', 'archive']


let program = new Program()
program
    .description('Compare database seed of the operators')
    .option('-o, --operators <name>', 'The target operator name', { required: true, choices: Object.keys(cfg.operators) })
    .option('--base <operator>', 'The operator which database will be used as base for the comparison. By default will be used the first one from the --operators list')
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

    let sshMaster = await new SSHClient().connect({host: dbs.backups.master, username: 'dopamine'})
    let dbMaster = await new MySQL().connect({user: ronly.user, password: ronly.password}, sshMaster)
    
    let sshArchive = await new SSHClient().connect({host: dbs.backups.archive, username: 'dopamine'})
    let dbArchive = await new MySQL().connect({user: ronly.user, password: ronly.password}, sshArchive)
    
    
    for (let dbType of DATABASES) {
        let db = dbType === 'archive' ? dbArchive : dbMaster
        let dbname = cfg.getOperatorDatabaseName(operator, dbType)
        console.warn(`\nDumping ${dbname}..`)
        await db.query(`USE ${dbname};`)
        
        await dump({
            connection: db.getConnection(),
    
            dest: DEST + '/' + dbname + '.sql',
            modifiers: [
                (output) => output.replace(/ AUTO_INCREMENT=\d+/g, '')
            ],
            
            sortKeys: true,
            exportSchema: false,
            exportData: true, // be careful with this option on mirrors
    
            reorderColumns: {
                _commands: 'command ASC',
                // platform
                languages: 'name ASC',
                settings: 'type ASC',
                translations: '`key` ASC',
                games: 'gameName ASC',
                games_maths: 'mathName ASC',
                // panel
                _configuration: '`key` ASC',
            },
            excludeColumns: {
                _commands: ['id','timeLastRun', 'status'],
                // platform
                settings: ['id','value'],
                languages: ['id'],
                translations: ['translationId'],
                games: ['id', 'status', 'gameNameMask'],
                games_maths: ['id'],
                // panel
                _roles: ['createdAt', 'updatedAt'],
                _configuration: ['id', 'value'],
            },
            
            includeTables: [
                // common
                "_commands",
                // platform
                "games_providers",
                "languages",
                "settings",
                "transactions_rgi_statuses",
                "transactions_round_statuses",
                "transactions_statuses",
                "transactions_types",
                "translations",
                "games",
                "games_maths",
                // panel
                "_roles",
                "_configuration",
            ]
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
    
    console.log(`\n\n################### DIFF ${operator} vs ${baseOperator} ###################`)
    
    for (let dbType of DATABASES) {
        const BASE = cfg.getOperatorDatabaseName(baseOperator, dbType) + '.sql'
        const TARGET = cfg.getOperatorDatabaseName(operator, dbType) + '.sql'
        
        let base   = fs.readFileSync(DEST + '/' + BASE, 'utf8');
        let target = fs.readFileSync(DEST + '/' + TARGET, 'utf8');
        
        let diffs = diff.diffLines(target, base);
        
        let totalDiffs = 0
        console.log(`# Compare ${TARGET} against ${BASE}..`)
        diffs.forEach((part, i) => {
            // green for additions, red for deletions, grey for common parts
            let color = part.added ? 'green' : part.removed ? 'red' : 'grey';
            if (part.added || part.removed) {
                totalDiffs += part.count
                if (part.added) {
                    console.info(colors.green(part.value.trim().replace(/^/mg, '+')));
                } else {
                    console.info(colors.red(part.value.trim().replace(/^/mg, '-')));
                }
            }
        })
        if (totalDiffs > 0) {
            console.info(`\nTotal diffs: ${totalDiffs} lines`)
            console.info(`See: diff ${DEST + '/' + BASE} ${DEST + '/' + TARGET}`)
            console.info('-'.repeat(60))
        }
    }
}))
    
