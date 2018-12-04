#!/usr/bin/env node
'use strict';

/**
 * Usage:
 * $ node deploy/hermes-env/check --operator rtg --location belgium
 */


const Program = require('dopamine-toolbox').Program
const cfg = require('configurator')

let program = new Program({ chat: cfg.chat.rooms.devops })

const promisify = require('util').promisify
const lookup = promisify(require('dns').lookup)
const curl = async (url) => {
    let shell = await program.shell()
    let res = await shell.exec(`curl -s ${url}`, { silent: true })
    if (!res) throw Error('Empty response')
    let json
    try{
        json = JSON.parse(res)
    } catch (e) {
        throw Error(e.toString() + `\n${res}`)
    }
    
    if (!json || !json.success) console.warn('WARNING! The response is not successful\n', json)
}


program
    .option('-o, --operators <name>', 'The target operator name', { required: true, choices: Object.keys(cfg.operators) })
    
    .iterate('operators', async (operator) => {
        
        // Configuration
        const DIR = cfg.operators[operator].dir
        const DOMAIN = cfg.operators[operator].domain
        
        
        // Checkers
        let tester = program.tester(operator)
        let it = tester.it
        
        it('should have DNS records for gserver', async () => await lookup(`gserver-${DIR}.${DOMAIN}`))
        it('should have DNS records for gpanel', async () => await lookup(`gpanel-${DIR}.${DOMAIN}`))
        it('have heartbeat to launcher', async () => await curl(`https://gserver-${DIR}.${DOMAIN}/${DIR}/launcher/heartbeat`))
        it('have heartbeat to platform', async () => await curl(`https://gserver-${DIR}.${DOMAIN}/${DIR}/platform/heartbeat`))
        it('have heartbeat to gpanel', async () => await curl(`https://gpanel-${DIR}.${DOMAIN}/${DIR}/api/heartbeat`))
        // it('have heartbeat to campaigns', async () => await curl(`https://gserver-${DIR}.${DOMAIN}/${DIR}/campaigns/heartbeat`))
        // it('have heartbeat to replay', async () => await curl(`https://gserver-${DIR}.${DOMAIN}/${DIR}/replay/heartbeat`))
    
        await tester.run()
    })
    