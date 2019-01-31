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
const TEMPLATES = __dirname.replace(/\\/g, '/') + '/templates/prometheus'
const DEST = `d:/www/monitoring/`

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

let program = new Program()
program
.description('Generate prometheus config specific location')
.run(async () => {
    console.log(`Generating server-conf..`)
    const dest = (program.params.dest || DEST).replace(/\\/g, '/') + `prometheus`

    let templates = (await new Shell().exec(`cd ${TEMPLATES} && find -type f`, { silent: true })).split('\n').map(t => t.trim().slice(2))

    let hosts = Object.values(cfg.hosts).filter(h => h.network === 'live' || h.network === 'devops').map(i => i.name)
    let mysqlServers = []
    let nodeServers = []

    hosts.forEach( (host)=> {
        let hostInfo = cfg.getHost(host)

        if(hostInfo.type.includes('mysql')) {
            mysqlServers.push(hostInfo)
        }
        nodeServers.push(hostInfo)
    })

    for(let file of templates) {
        if (file.endsWith('.hbs')) {
            const template = Handlebars.compile(fs.readFileSync(`${TEMPLATES}/${file}`).toString(), {noEscape: true})

            let name = dest + '/' + file.slice(0, -'.hbs'.length)

            let vars = {
                node: nodeServers,
                mysql: mysqlServers,
            }

            let content = template(vars)
            await save(name, content)
        }
    }
})

