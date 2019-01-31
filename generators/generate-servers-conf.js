#!/usr/bin/env node
'use strict';

// TODO: support dev
const Program = require('dopamine-toolbox').Program
const Shell = require('dopamine-toolbox').Shell
const cfg = require('configurator')
const fs = require('fs')
const path = require('path')
const Handlebars = require('handlebars')

const NEW_LINE = '\r\n'; //require('os').EOL
const TEMPLATES = __dirname.replace(/\\/g, '/') + '/templates/server'
const DEST = `d:/www/servers`

let program = new Program()
program
    .description('Generate server-conf for specific location')
    .option('-l, --locations <list|all>', 'The target location', {choices: Object.keys(cfg.locations), required: true})
    .option('-d, --dest <path>', 'Output generated data to destination path (could be handlebars template)')
    .option('--commit [msg]', 'Attempt to commit generate files')
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
            maxRequests: 1000,
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
    
    console.log('Resetting servers conf repo')
    let shell = new Shell()
    await shell.exec(`cd ${dest} && git reset --hard && git checkout -q master && git pull -q --ff-only origin master`)
    // if (location !== 'dev') {
    //     await shell.exec(`cd ${dest} && mv nginx/conf.d/allow .keep.allow && rm -rf */ && mkdir -p nginx/conf.d/ && mv .keep.allow nginx/conf.d/allow`) // TODO: protect!
    // }
    
    let templates = (await program.shell().exec(`cd ${TEMPLATES} && find -type f`, { silent: true })).split('\n').map(t => t.trim().slice(2))
    
    for(let file of templates){
        // console.log(file, '=>')
        
        if(file.includes('data-service.conf')) { // skips data-services confs when is used externally
            console.log(`[SKIP] ${dest}/${file}`)
            if(cfg.locations[location].dataService.external === true) continue
        }
        
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
                    let content = template(vars)
                    await save(name, content)
                }
            }
            else if (file.includes('DOMAIN')) {
                for (let domain of cfg.locations[location].domains) {
                    let name = dest + '/' + file.replace(/DOMAIN/g, domain).slice(0, -'.hbs'.length)
                    let vars = {
                        domain: domain,
                        server: cfg.locations[location],
                        serverOperators: null,
                        operator: null
                    }
                    let content = template(vars)
                    await save(name, content)
                }
            }
            else {
                let name = dest + '/' + file.slice(0, -'.hbs'.length)
    
                let serverOperators = Object.values(cfg.operators)
                  .filter(o => o.location === location)
                  .map(operator => {
                      operator['_dbMaster'] = cfg.databases[operator.databases].master
                      return operator
                  })
                
                let vars = {
                    server: cfg.locations[location],
                    serverOperators: serverOperators,
                    operator: null
                }
                let content = template(vars)
                await save(name, content)
            }
        } else {
            let name = dest + '/' + file
            let content = fs.readFileSync(TEMPLATES + '/' + file).toString()
            await save(name, content)
        }
    
    }
    
    if(program.params.commit){
        await new Shell().exec(`cd ${dest} && TortoiseGitProc -command commit -logmsg "${typeof program.params.commit === 'string' ? program.params.commit : ''}"`)
    }
})

