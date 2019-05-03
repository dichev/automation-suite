#!/usr/bin/env node
'use strict';

// TODO: support dev
const Program = require('dopamine-toolbox').Program
const Shell = require('dopamine-toolbox').Shell
const cfg = require('configurator')
const fs = require('fs')
const path = require('path')
const isWin = require('os').platform() === 'win32'
const Handlebars = require('handlebars')

const NEW_LINE = '\r\n'; //require('os').EOL
const TEMPLATES = __dirname.replace(/\\/g, '/') + '/templates/server'
const DEST = cfg.dirs.serversConfRepos

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
    const dest = (program.params.dest || DEST).replace(/\\/g, '/') + `/servers-conf-${location}`
    
    console.log('\nResetting servers conf repo')
    let shell = new Shell()
    await shell.exec(`cd ${dest} && git clean -fd && git reset --hard && git checkout -q master && git pull -q --ff-only origin master`)
    if (location !== 'dev') {
        console.log('\nCleaning all repo files except the allow lists..')
        if(!dest.endsWith(`/servers-conf-${location}`)) throw Error('Safety hazard, attempting to delete (with rm -f) unexpected directory: '+ dest) // we should be very careful here
        await shell.exec(`cd ${dest} && rm -rfv */ && git checkout nginx/conf.d/allow/*.conf`)
    }
    
    let templates = (await program.shell().exec(`cd ${TEMPLATES} && find -type f`, { silent: true })).split('\n').map(t => t.trim().slice(2))
    console.log('\nGenerating configurations from templates..')
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
            else if (file.includes('HOST')) {
                let HOSTS = Object.values(cfg.hosts).filter(h => h.location === location)

                for (let host of HOSTS) {
                    let name = dest + '/' + file.replace(/HOST/g, host.name).slice(0, -'.hbs'.length)
                    let vars = {
                        host: host.name,
                        server: cfg.locations[location]
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
                      operator['_dbJackpots'] = cfg.databases[operator.databases].jackpots && cfg.databases[operator.databases].jackpots.master || null
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
        let shell = new Shell()
        let message = typeof program.params.commit === 'string' ? program.params.commit : 'Update servers configs'
        if(isWin) {
            await shell.exec(`cd ${dest} && TortoiseGitProc -command commit -logmsg "${message}"`)
        } else {
            await shell.exec(`cd ${dest} && git add . && git commit -m "${message}"`)
            console.log(`\n\nDon't forget to review the changes and then push`)
            console.log(`cd ${dest} && git diff HEAD^ HEAD`)
            console.log(`cd ${dest} && git push`)
        }
    }
})

