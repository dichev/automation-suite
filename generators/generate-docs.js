#!/usr/bin/env node
'use strict';

/**
 * Usage:
 * $ node bin/docs/generate
 */

const Program = require('dopamine-toolbox').Program
const inspect = require('util').inspect
const fs = require('fs')
const path = require('path')
const Handlebars = require('handlebars')

const TEMPLATES = __dirname.replace(/\\/g, '/') + '/templates/docs'

const templates = {
    main: Handlebars.compile(fs.readFileSync(TEMPLATES + '/README_main.hbs').toString()),
    program: Handlebars.compile(fs.readFileSync(TEMPLATES + '/README_program.hbs').toString()),
}

const GROUPS = [
    'deploy',
    'servers',
    'generators',
    'office',
    'dba',
]

let program = new Program()

program
    .description('Auto-generate README files with commands help')
    .option('-g, --groups <list|all>', 'The target commands groups', { choices: GROUPS, required: true })

    .iterate('groups', async (group) => {
        const shell = program.shell()
        
        let base = path.normalize(__dirname + '/../' + group)
        let programs = fs.readdirSync(base).filter(file => fs.lstatSync(base + '/' + file).isDirectory())
        let commands = {}
        for(let name of programs){
            commands[name] = fs.readdirSync(base + '/' + name).filter(file => file.endsWith('.js') && !file.startsWith('.') && file === file.toLocaleLowerCase()).map(file => file.substring(0, file.length-3))
        }

        let data = { programs: {} }
        
        for(let name of programs){
            data.programs[name] = { name: name, commands: {} }
            for(let command of commands[name]){
                let cmd = `node ${group}/${name}/${command} --help`
                console.log(cmd)
                
                let help = await shell.exec(cmd, {silent: true})
                let [all, usage, description, options, additional] = help.trim().match(/(Usage.+)\s([\s\S]+)(Options[\s\S]+)(Additional Options[\s\S]+)/).map(m => m.trim())
                
                data.programs[name].commands[command] = {
                    name: command,
                    shortDescription: description.charAt(0).toLowerCase() + description.slice(1, 100) + (description.length > 100 ? '..' : ''),
                    description: description,
                    help: help.replace('Usage: node ', `Usage: node ${name === 'BASE' ? '' : group + '/'}`)
                              .replace(/(Additional Options:)([\s\S]+)/gm, '$1 (see global options)')
                }
            }
            
            // const README = path.normalize(`${base}/${name}/README.md`)
            // fs.writeFileSync(README, templates.program(data.programs[name]))
            // console.log(`Generated: ${README}\n`)
            
            // break
        }
        // console.log(inspect(data, {depth: 5, colors: true}))
        
        const README = path.normalize(`${base}/README.md`)
        fs.writeFileSync(README, templates.main(data))
        console.log(`Generated: ${README}\n`)
    })
