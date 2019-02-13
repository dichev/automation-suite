#!/usr/bin/env node
'use strict';

const Program = require('dopamine-toolbox').Program
const cfg = require('configurator')

let program = new Program({chat: ''})
String.prototype.grep = function(reg){ reg = new RegExp(reg,'i'); return this.split("\n").filter( line => line.match(reg) ).join("\n") }

program
    .description('Show operators by location')
    .option('-l, --locations <list|all>', `Comma-separated list of Locations`, {choices: Object.keys(cfg.locations), required: true})
    .option('-g, --grep <string>', `Expression to apply as filter`, {required: false})
    .iterate('locations', async (location) => {
        let operators = Object.values(cfg.operators).filter(o => o.location === location ).map(o => o.name)
        if(program.params.grep){
           operators = operators
                .join('\n')
                .grep(program.params.grep)
                .split('\n')
        }
        console.log(operators.join(','))
    })
