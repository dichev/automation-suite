#!/usr/bin/env node
'use strict';

const Program = require('dopamine-toolbox').Program
const cfg = require('configurator')

//let program = new Program({ chat: cfg.chat.rooms.devops })
let program = new Program({ chat: ''})

program
    .description('Tiny proxy setup.')
    .option('-l, --locations <list|all>', 'Location', {choices: Object.keys(cfg.locations), required: true})

program
    .iterate('locations', async (location) => {
        console.log(cfg.locations[location]);
    })