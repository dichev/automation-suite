#!/usr/bin/env node
'use strict';

/**
 * Usage:
 * $ node bin/hermes-env/check --env rtg --location belgium
 */


const Deployer = require('deployer2')
const cfg = require('configurator')

let deployer = new Deployer()

const promisify = require('util').promisify
const lookup = promisify(require('dns').lookup)
const curl = async (url) => {
    let shell = await deployer.shell()
    let res = await shell.exec(`curl -s ${url}`, { silent: true })
    if (!res) throw Error('Empty response')
    let json = JSON.parse(res)
    if (!json || !json.success) console.warn('WARNING! The response is not successful\n', json)
}


deployer
    .option('-e, --env <name>', 'The target env name')
    .option('-l, --location <name>', 'The target location')
    
    .run(async () => {
        
        // Configuration
        const OPERATOR = deployer.params.env
        const DOMAIN = cfg.operators[OPERATOR].domain
        
        
        // Checkers
        let tester = deployer.tester()
        let it = tester.it
        
        it('should have DNS records for gserver', async () => await lookup(`gserver-${OPERATOR}.${DOMAIN}`))
        it('should have DNS records for gpanel', async () => await lookup(`gpanel-${OPERATOR}.${DOMAIN}`))
        it('have heartbeat to launcher', async () => await curl(`https://gserver-${OPERATOR}.${DOMAIN}/${OPERATOR}/launcher/heartbeat`))
        it('have heartbeat to platform', async () => await curl(`https://gserver-${OPERATOR}.${DOMAIN}/${OPERATOR}/platform/heartbeat`))
        it('have heartbeat to gpanel', async () => await curl(`https://gpanel-${OPERATOR}.${DOMAIN}/${OPERATOR}/api/heartbeat`))
        it('have heartbeat to campaigns', async () => await curl(`https://gserver-${OPERATOR}.${DOMAIN}/${OPERATOR}/campaigns/heartbeat`))
        it('have heartbeat to replay', async () => await curl(`https://gserver-${OPERATOR}.${DOMAIN}/${OPERATOR}/replay/heartbeat`))
    
        await tester.run()
    })
    