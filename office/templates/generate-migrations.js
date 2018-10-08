#!/usr/bin/env node
'use strict';


const Program = require('dopamine-toolbox').Program
const cfg = require('configurator')
const fs = require('fs')
const path = require('path')
const Handlebars = require('handlebars')

const NEW_LINE = '\r\n'; //require('os').EOL

const MIGRATION = `/d/www/servers/template-generator/templates/migrations/migration.sql.hbs`
const DEST = __dirname + '/output'

let program = new Program()
program
    .description('Generate anything from handlebars templates')
    .option('-t, --template <path>', 'Path to handlebars template', { def: MIGRATION })
    .option('-d, --dest <path>', 'Output generated data to destination path (could be handlebars template)')
    .parse()



program.run(async () => {
    console.log(`Generating SQL migrations..`)
    const template =  Handlebars.compile(fs.readFileSync(program.params.template).toString(), {noEscape: true})
    const dest = program.params.dest || DEST
    
    for(let location of Object.keys(cfg.locations)){
        let content = ''
        let file = `${dest}/${location}.sql`
        
        for (let operator of Object.values(cfg.operators).filter(o => o.location === location)) {
            const vars = {operator: cfg.operators[operator]}
            content += template(vars) + NEW_LINE + NEW_LINE
        }
    
        fs.writeFileSync(file, content.replace(/\r?\n/g, NEW_LINE)) // unify new lines
        console.log(file)
    }
   
})
