#!/usr/bin/env node
'use strict'

const Program = require('dopamine-toolbox').Program
const cfg = require('configurator')
const fetch = require('node-fetch')

let program = new Program()

const ERROR = {
    INVALID_JSON_ERROR: 'Request body is not valid json',
    UNEXPECTED_ERROR: 'Unexpected error',
    CONNECTION_ERROR: 'Connection error',
}

const cachebust = async (url, apiKey) => {
    let response, body, error
    try {
        response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + apiKey,
            }
        })
        body = await response.json();

        if (body.error || body.success === false) {
            throw body.error && body.error.msg || { msg: ERROR.UNEXPECTED_ERROR }
        } else if (response.status !== 200) {
            throw response.statusText || { msg: ERROR.CONNECTION_ERROR }
        }

        console.log(`Success! Cleared cache for ${url}`);
    } catch(err) {
        error = err
        console.warn(`Could not clear cache for [${url}] : [${response && response.status}] ${JSON.stringify(error)}`)
    }

    return {error, response, body}
}


let errors = 0

program
    .description('Cachebust html assets')
    .option('-o, --operators <list|all>', `Comma-separated list of operators`, {choices: Object.keys(cfg.operators), required: true})

    .iterate('operators', async (name) => {
        const operator = cfg.operators[name]
        const url = `https://gserver-${operator.dir}.${operator.domain}/${operator.dir}/launcher/cachebust`
        const apiKey = cfg.access.hermes.launcher.apiKey
        // console.log(url)
        
        await program.chat.message(`\nCachebust ${name}`)
        let result = await cachebust(url, apiKey)
        
        if(result.error) errors++
    })
    .then(async () => {
         if(errors){
            throw Error(`There was a problem with the cachebust. Please investigate the ${errors} errors above!`)
        }
    })
