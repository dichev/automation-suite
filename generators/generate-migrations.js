#!/usr/bin/env node
'use strict';


const Program = require('dopamine-toolbox').Program
const cfg = require('configurator')
const fs = require('fs')
const path = require('path')
const Handlebars = require('handlebars')

const NEW_LINE = '\r\n'; //require('os').EOL

const TEMPLATES = __dirname.replace(/\\/g, '/') + '/templates'
const MIGRATION = TEMPLATES + '/migrations/migration.sql.hbs'
const DEST = __dirname + '/output'

let program = new Program()
program
    .description('Generate SQL migrations by location')
    .option('-t, --template <path>', 'Path to handlebars template', { def: MIGRATION })
    .option('-d, --dest <path>', 'Output generated data to destination path (could be handlebars template)')
    .parse()



program.run(async () => {
    console.log(`Generating SQL migrations..`)
    const template =  Handlebars.compile(fs.readFileSync(program.params.template).toString(), {noEscape: true})
    const dest = program.params.dest || DEST
    const dbtype = path.basename(program.params.template).split('-')[0] || 'UNKNOWN'
    
    for(let location of Object.keys(cfg.locations)){
        let content = ''
        let file = `${dest}/${location}.sql`
        
        for (let operator of Object.values(cfg.operators).filter(o => o.location === location)) {
            const vars = { operator }
            content += `USE ` + operator.dbPrefix + dbtype + ';' + NEW_LINE
            content += template(vars)
            content += NEW_LINE + NEW_LINE + NEW_LINE
        }
    
        fs.writeFileSync(file, content.replace(/\r?\n/g, NEW_LINE)) // unify new lines
        console.log(file)
    }
   
})
