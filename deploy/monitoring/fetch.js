#!/usr/bin/env node
'use strict';

const Program = require('dopamine-toolbox').Program
const cfg = require('configurator')
const fs = require('fs')
const deepMerge = require('deepmerge')
const log = console.log;

//---------------------
const emptyTarget = value => Array.isArray(value) ? [] : {}
const clone = (value, options) => deepMerge(emptyTarget(value), value, options)
function combineMerge(target, source, options) {
    const destination = target.slice()

    source.forEach(function(e, i) {
        if (typeof destination[i] === 'undefined') {
            const cloneRequested = options.clone !== false
            const shouldClone = cloneRequested && options.isMergeableObject(e)
            destination[i] = shouldClone ? clone(e, options) : e
        } else if (options.isMergeableObject(e)) {
            destination[i] = deepMerge(target[i], e, options)
        } else if (target.indexOf(e) === -1) {
            destination.push(e)
        }
    })
    return destination
}
//---------------------

// Configuration
const TEMPLATES = "d:/www/servers/template-generator";
const GRAFANA   = "d:/www/servers/grafana-sensors";

let program = new Program({ chat: cfg.chat.rooms.test });
program
    .description('Add new operator configuration in Grafana-Sensors')
    .example(`
        node deploy/monitoring/fetch -l iom -e rank
    `)
    .option('-e, --env <name>', 'The target env name', { required: true })
    .option('-l, --location <name>', 'The target location', { required: true })
    .run(async () => {
        const OPERATOR = program.params.env;
        const SERVER = program.params.location;
        
        // Templating the environment
        log("Generating monitoring configurations from templates..")
        let shell = await program.shell()
        await shell.chdir(TEMPLATES)
        await shell.exec(`bin/generator -t templates/monitoring/monitoring.json.hbs -s ${SERVER} -o ${OPERATOR} -d ${SERVER}/${OPERATOR}/monitoring/${OPERATOR}.json`)
        await shell.exec(`bin/generator -t templates/monitoring/sensors.json.hbs    -s ${SERVER} -o ${OPERATOR} -d ${SERVER}/${OPERATOR}/monitoring/${OPERATOR}-sensors.json`)
        
        // Append new config to sensors.json
        let sensors         = JSON.parse(fs.readFileSync(`${GRAFANA}/config/sensors.json`, 'utf8'));
        let operatorSensors = JSON.parse(fs.readFileSync(`${TEMPLATES}/output/${SERVER}/${OPERATOR}/monitoring/${OPERATOR}-sensors.json`, 'utf8'));
        
        // Remove jackpots if not available
        let jackpotAnswer = await program.ask("Does the env has Jackpots enabled?", ['yes', 'no'], 'yes');
        if(jackpotAnswer === 'no') delete operatorSensors.templates['opsJackp'];
    
        // Remove bonuses if not available
        let bonusAnswer = await program.ask("Does the env has Bonuses enabled?", ['yes', 'no'], 'yes');
        if(bonusAnswer === 'no') delete operatorSensors.templates['opsBonus'];
        
        // Merge objects
        const result = deepMerge(sensors, operatorSensors,{arrayMerge: combineMerge});
    
        // Save to sensors.json
        fs.writeFileSync(`${GRAFANA}/config/sensors.json`, JSON.stringify(result, null, 4));
    
        log("Coping operator config file to GRAFANA")
        await shell.exec(`cp ${TEMPLATES}/output/${SERVER}/${OPERATOR}/monitoring/${OPERATOR}.json ${GRAFANA}/config/operators/${OPERATOR}.json`);
    
        log("Please review and commit the changes")
        await shell.exec(`cd ${GRAFANA} && TortoiseGitProc -command commit -logmsg "[env] Add new env: ${OPERATOR}"`)
        log("Done")
    });
