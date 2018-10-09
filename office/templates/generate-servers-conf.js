#!/usr/bin/env node
'use strict';

// TODO: support dev
const Program = require('dopamine-toolbox').Program
const cfg = require('configurator')
const fs = require('fs')
const path = require('path')
const Handlebars = require('handlebars')

const NEW_LINE = '\r\n'; //require('os').EOL
const TEMPLATES = `d:/www/servers/template-generator/templates/server`
const DEST = `d:/www/servers`

let program = new Program()
program
    .description('Generate server-conf for specific location')
    .option('-l, --locations <list|all>', 'The target host name', {choices: Object.keys(cfg.locations), required: true})
    .option('-d, --dest <path>', 'Output generated data to destination path (could be handlebars template)')
    .parse()


const save = async (file, content) => {
    console.log(file)
    let dir = path.dirname(file).replace(/\\/g, '/')
    if (!fs.existsSync(dir)) await program.shell().exec(`mkdir -pv ${dir}`)
    
    if(file.includes('nginx/conf.d/allow') && fs.existsSync(file)) {
        console.log('[SKIP]', file)
    } else {
        fs.writeFileSync(file, content.replace(/\r?\n/g, NEW_LINE)) // unify new lines
    }
}

const getOperatorVars = (operator) => {// TODO: these are custom mappings from template-generator. should be removed soon
    return Object.assign({}, operator, {
        fpm: {
            shared: false,
            maxRequests: 1500,
            port: operator.fpm.port,
            processes: operator.fpm.processes
        },
        suffix: '',
        basicAuth: false,
        serverCustom: null,
        databases: {
            master: cfg.databases[operator.databases].master,
            archive: cfg.databases[operator.databases].archive,
            slave: cfg.databases[operator.databases].slave,
        }
    })
}

program.iterate('locations', async (location) => {
    console.log(`Generating server-conf..`)
    const dest = (program.params.dest || DEST).replace(/\\/g, '/') + `/servers-conf-${location}`
    
    let templates = (await program.shell().exec(`cd ${TEMPLATES} && find -type f`, { silent: true })).split('\n').map(t => t.trim().slice(2))
    
    for(let file of templates){
        // console.log(file, '=>')
        
        if (file.endsWith('.hbs')) {
            const template = Handlebars.compile(fs.readFileSync(`${TEMPLATES}/${file}`).toString(), {noEscape: true})
    
            if (file.includes('OPERATOR')) {
        
                for (let operator of Object.values(cfg.operators).filter(o => o.location === location)) {
                    let name = dest + '/' + file.replace(/OPERATOR/g, operator.dir).slice(0, -'.hbs'.length)
                    let vars = {
                        server: cfg.locations[location], // TODO: rename to location in templates
                        serverOperators: null,
                        operator: getOperatorVars(operator)
                    }
                    let content = template(vars) + NEW_LINE + NEW_LINE
                    await save(name, content)
                }
            }
            else {
                let name = dest + '/' + file.slice(0, -'.hbs'.length)
                let vars = {
                    server: cfg.locations[location], // TODO: rename to location in templates
                    serverOperators: Object.values(cfg.operators).filter(o => o.location === location), // TODO check that
                    operator: null
                }
                let content = template(vars) + NEW_LINE + NEW_LINE // TODO: remove these new lines
                await save(name, content)
            }
        } else {
            let name = dest + '/' + file
            let content = fs.readFileSync(TEMPLATES + '/' + file).toString()
            await save(name, content)
        }
    
    }
})

