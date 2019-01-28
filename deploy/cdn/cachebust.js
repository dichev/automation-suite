#!/usr/bin/env node
'use strict'

/**
 * Usage:
 * $ node deploy/cdn/cachebust --hosts dev-hermes-lb
 */

const Program = require('dopamine-toolbox').Program
const cfg = require('configurator')
const fetch = require('node-fetch')
const HOSTS = Object.values(cfg.hosts).filter(h => h.type === 'cdn').map(h => h.name)

let program = new Program()

const errors = {
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
            throw body.error && body.error.msg || { msg: errors.UNEXPECTED_ERROR }
        } else if (response.status !== 200) {
            throw response.statusText || { msg: errors.CONNECTION_ERROR }
        }

        console.log(`Success! Cleared cache for ${url}`);
    } catch(err) {
        error = err
        console.warn(`Could not clear cache for [${url}] : [${response && response.status}] ${JSON.stringify(error)}`)
    }

    return {error, response, body}
}


program
    .description('Cachebusting html assets')
    .option('-h, --hosts <list|all>', `Comma-separated list of cdn regions`, {choices: HOSTS, required: true})

    .iterate('hosts', async (host) => {

        const chat = program.chat
        await chat.notify(`\nStarting cachebust for ${host}`)

        const apiKey = cfg.access.hermes.launcher.apiKey

        let operators = Object.keys(cfg.operators).filter(key => cfg.operators[key].cdn === host && cfg.operators[key].live === true).map(key => cfg.operators[key]);
        let requests = []
        if(!operators.length) return console.warn(`No operators found for host: ${host}`)

        for (let i = 0; i < operators.length; i++) {
            let url = `https://gserver-${operators[i].dir}.${operators[i].domain}/${operators[i].dir}/launcher/cachebust`
            requests.push(await cachebust(url, apiKey))
        }

        //TODO This will exit when a cachebust fails for a single host
        if(requests && requests.find((request) => request.error)){
            await chat.notify(`\nThere was a problem with the cachebust. Please investigate!`)
            throw Error('There was a problem with the cachebust. Please investigate!')
        }

    })
