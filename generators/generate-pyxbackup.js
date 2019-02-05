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
const TEMPLATES = __dirname.replace(/\\/g, '/') + '/templates/pyxbackup'
const DEST = cfg.dirs.serversConfRepos

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

function getDays(item) {
    let nums = [...Array(7).keys()];
    let index = nums.indexOf(item);
    if (index !== -1) nums.splice(index, 1);

    return nums;
}
let i=0;

let program = new Program()
program
.description('Generate pyxbackup config specific location')
.option('-h, --hosts <list|all>', 'The target host names', { choices: Object.keys(cfg.hosts), required: true })
.option('-f, --force', 'Skip manual changes validations and proceed on your risk')
.iterate('hosts', async (host) => {
    console.log(`Generating pyxbackup...`)
    const dest = (program.params.dest || DEST).replace(/\\/g, '/') + `/servers-conf-mysql/pyxbackup`
    console.log(host)

    let templates = (await new Shell().exec(`cd ${TEMPLATES} && find -type f`, { silent: true })).split('\n').map(t => t.trim().slice(2))

    for(let file of templates) {
        if (file.endsWith('.hbs')) {
            const template = Handlebars.compile(fs.readFileSync(`${TEMPLATES}/${file}`).toString(), {noEscape: true})
                let name = dest + '/' + file.slice(0, -'.hbs'.length).replace(/host/, host)

            let vars = {
                host: host,
                fullDays: i,
                incrDays: getDays(i),
                hour: host.includes('archive') ? 14  : 8,
            }

            let content = template(vars)
            await save(name, content)
        }
    }
    i++;
    if(i === 7) i=0;
})