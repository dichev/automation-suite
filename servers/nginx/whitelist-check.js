#!/usr/bin/env node
'use strict';

const Program = require('dopamine-toolbox').Program
const cfg = require('configurator')
const Shell = require('dopamine-toolbox').Shell
const fs = require('fs')
const RootDir = require('os').tmpdir().replace(/\\/g, '/') + '/dope-'+ Date.now() // windows compatibility

let program = new Program({chat: ''})
let shell = new Shell()
fs.mkdirSync(RootDir)
String.prototype.grep = function(reg){ reg = new RegExp(reg,'i'); return this.split("\n").filter( line => line.match(reg) ).join("\n") }

program
    .description("List ips for operator")
    .option('-o, --operators <list|all>', `Comma-separated list of operators`, {choices: Object.keys(cfg.operators), required: true})
    .iterate('operators', async (operator) => {
        let location = cfg.getLocationByOperator(operator).name
        let gitProject = 'servers-conf-' + location
        let configFile = `${RootDir}/${gitProject}/nginx/conf.d/allow/${operator}.conf`

        await shell.chdir(RootDir)
        if(fs.existsSync(`${RootDir}/${gitProject}`)){
            await shell.chdir(`${RootDir}/${gitProject}`)
            await shell.exec('git pull',{silent:true})
        }else{
            await shell.exec(`git clone git@gitlab.dopamine.bg:servers/servers-conf-${location}.git`,{silent:true})
        }
        if( fs.existsSync(configFile)) console.log(fs.readFileSync(configFile).toString().grep('^allow'))
    })
