#!/usr/bin/env node
'use strict';

const Program = require('dopamine-toolbox').Program
const Shell = require('dopamine-toolbox').Shell
const cfg = require('configurator')
const fs = require('fs')
const path = require('path')
const Handlebars = require('handlebars')
const Calc = require('./lib/Calc')
const Helpers = require('./lib/Helpers')

const NEW_LINE = '\r\n'; //require('os').EOL

const DEST = __dirname + '/output'
const TEMPLATES = __dirname.replace(/\\/g, '/') + '/templates'
const SERVER_CONF_REPOS = cfg.dirs.serversConfRepos

let program = new Program()
program
    .description('Generate all configurations for new operator deployment')
    .option('-o, --operator <name>', 'The operator name, stored in conifg file', { choices: Object.keys(cfg.operators), required: true })
    .option('-d, --dest <path>', 'Output generated data to destination path (could be handlebars template)')
    .option('--no-refresh-masters', 'Skip ensuring the masters are at expected revision')
    .parse()


const generate = async (source, dest, vars) => {
    console.log(dest)
    let dir = path.dirname(dest).replace(/\\/g, '/')
    if (!fs.existsSync(dir)) await program.shell().exec(`mkdir -p ${dir}`)
    
    const template = Handlebars.compile(fs.readFileSync(source).toString(), {noEscape: true})
    const content = template(vars)
    fs.writeFileSync(dest, content.replace(/\r?\n/g, NEW_LINE)) // unify new lines
}

program.run(async () => {
    console.log(`Generating SQL migrations..`)

    const operator = program.params.operator
    const location = cfg.operators[operator].location
    const dest = (program.params.dest || DEST).replace(/\\/g, '/') + '/' + operator
    const shell = new Shell()
    
    await shell.exec(`mkdir -pv ${dest}`)
    
    const SECRET_FILE = `${dest}.secret.json`
    if(!fs.existsSync(SECRET_FILE)){
        console.log('Missing secret operator file!')
        let file = fs.readFileSync(process.env.DOPAMINE_TEMPLATES_SECRET || `${TEMPLATES}/hermes/.secret.json.hbs`, 'utf8')
        file = file.replace('{{operator.name}}', operator)
        fs.writeFileSync(SECRET_FILE, file)
        console.log('Please fill all configurations here:\n' + SECRET_FILE)
        await program.confirm('Continue?')
    }
    const secret = JSON.parse(fs.readFileSync(SECRET_FILE).toString())
    
    const operatorSeed = secret.operatorSeed
    await program.confirm('Please ensure the operator seed config is up to date: \n' + operatorSeed)
    if (!fs.existsSync(operatorSeed)) {
        throw Error('Warning! The operator seed is not found at ${operatorSeed}!\n Aborting..')
    }
    
    
    let o = cfg.operators[operator]
    let vars = {
        custom: {
            passwords: {
                bonus:       Calc.generatePassword(20, 25),
                demo:        Calc.generatePassword(20, 25),
                jackpot:     Calc.generatePassword(20, 25),
                stats:       Calc.generatePassword(20, 25),
                platform:    Calc.generatePassword(20, 25),
                panel:       Calc.generatePassword(20, 25),
                segments:    Calc.generatePassword(20, 25),
                reports:     Calc.generatePassword(20, 25),
                ronly:       Calc.generatePassword(20, 25),
            },
            secret: secret,
            baseDir: 'd:/www/hermes/master'
        },
        operator: Object.assign({}, o, { databases: { // TODO
            master: cfg.databases[o.databases].master,
            archive: cfg.databases[o.databases].archive,
            slave: cfg.databases[o.databases].slave,
        }}),
        server: cfg.locations[o.location],
    }
    
    
    console.log('\nPreparing database seeds')
    console.log('Ensure all project repos are up to date..')
    if (program.params.refreshMasters !== false) {
        await shell.exec(`bash d:/www/_releases/hermes/.bin/init.sh`)
    }
    
    
    // execSync(`rm -rf output/${operator}`) // TODO

    // Generate sql migrations
    await generate(`${TEMPLATES}/sql/hermes-check.sql.hbs`,            `${dest}/db/check.sql`, vars)
    await generate(`${TEMPLATES}/sql/hermes-create.sql.hbs`,           `${dest}/db/master.sql`, vars)
    await generate(`${TEMPLATES}/sql/hermes-create-archive.sql.hbs`,   `${dest}/db/archive.sql`, vars)
    await generate(`${TEMPLATES}/sql/hermes-rollback.sql.hbs`,         `${dest}/db/master-rollback.sql`, vars)
    await generate(`${TEMPLATES}/sql/hermes-rollback-archive.sql.hbs`, `${dest}/db/archive-rollback.sql`, vars)
    await generate(`${TEMPLATES}/sql/hermes-seed.sql.hbs`,             `${dest}/db/seed.sql`, vars)
    await generate(`${TEMPLATES}/sql/hermes-schema.sql.hbs`,           `${dest}/db/schema.sql`, vars)
    await generate(`${TEMPLATES}/sql/hermes-schema-archive.sql.hbs`,   `${dest}/db/schema-archive.sql`, vars)
    console.log(operatorSeed, '->' , `${dest}/db/operator-seed.sql`)
    fs.copyFileSync(operatorSeed, `${dest}/db/operator-seed.sql`)
    
    
    // Generate hermes configurations
    await generate(`${TEMPLATES}/hermes/bonus.php.hbs`,                `${dest}/hermes/bonus/config/server.config.php`, vars)
    await generate(`${TEMPLATES}/hermes/campaigns.php.hbs`,            `${dest}/hermes/campaigns/config/server.config.php`, vars)
    await generate(`${TEMPLATES}/hermes/demo.php.hbs`,                 `${dest}/hermes/demo/config/server.config.php`, vars)
    await generate(`${TEMPLATES}/hermes/gateway.php.hbs`,              `${dest}/hermes/gateway/config/server.config.php`, vars)
    await generate(`${TEMPLATES}/hermes/gpanel.php.hbs`,               `${dest}/hermes/gpanel/api/config/server.config.php`, vars)
    await generate(`${TEMPLATES}/hermes/jackpot.php.hbs`,              `${dest}/hermes/jackpot/config/server.config.php`, vars)
    await generate(`${TEMPLATES}/hermes/launcher.php.hbs`,             `${dest}/hermes/launcher/config/server.config.php`, vars)
    await generate(`${TEMPLATES}/hermes/math-adapter.php.hbs`,         `${dest}/hermes/math/adapter/config/server.config.php`, vars)
    await generate(`${TEMPLATES}/hermes/platform.php.hbs`,             `${dest}/hermes/platform/config/server.config.php`, vars)
    await generate(`${TEMPLATES}/hermes/platform-env.php.hbs`,         `${dest}/hermes/platform/config/env.config.php`, vars)
    await generate(`${TEMPLATES}/hermes/replay.php.hbs`,               `${dest}/hermes/replay/config/server.config.php`, vars)
	await generate(`${TEMPLATES}/hermes/reports.php.hbs`,              `${dest}/hermes/reports/config/server.config.php`, vars)
    await generate(`${TEMPLATES}/hermes/rewards.php.hbs`,              `${dest}/hermes/rewards/config/server.config.php`, vars)
    await generate(`${TEMPLATES}/hermes/segments.php.hbs`,             `${dest}/hermes/segments/config/server.config.php`, vars)
    await generate(`${TEMPLATES}/hermes/stats.php.hbs`,                `${dest}/hermes/stats/config/server.config.php`, vars)
    await generate(`${TEMPLATES}/hermes/tournaments.php.hbs`,          `${dest}/hermes/tournaments/config/server.config.php`, vars)
    await generate(`${TEMPLATES}/hermes/wallet.php.hbs`,               `${dest}/hermes/wallet/config/server.config.php`, vars)


    // Generate server configurations
    console.log('Ready!\n Do not forget to generate server configs')
})
