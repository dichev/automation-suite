#!/usr/bin/env node
'use strict'

/**
 * Usage:
 * $ node deploy/cdn/cachebust --hosts dev-hermes-lb
 */

const Program = require('dopamine-toolbox').Program
const installed = require('./.installed')
const cfg = require('configurator')
const fetch = require('node-fetch')


let program = new Program()

const errors = {
	INVALID_JSON_ERROR: 'Request body is not valid json',
	UNEXPECTED_ERROR: 'Unexpected error',
	CONNECTION_ERROR: 'Connection error',
}

const cachebust = async (url, apiKey) => {
	let response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': 'Basic ' + apiKey,
		}
	})
	let body = await response.json()
	let error = {}

	try {
		body = JSON.parse(body)
	} catch (err) {
		error = { msg: errors.INVALID_JSON_ERROR }
	}
	if (body && (body.error || body.success === false)) error = body.error && body.error.msg || { msg: errors.UNEXPECTED_ERROR }
	else if (response && (response.statusCode !== 200)) error = response.responseText || response.statusText || { msg: errors.CONNECTION_ERROR }

	if(error) console.warn(`Could not clear cache for [${url}] : [${response && response.statusCode}] ${JSON.stringify(error)}`)

	return {error, response, body}
}


program
  .description('Cachebusting html assets')
  .option('-h, --hosts <list|all>', `Comma-separated list of cdn regions`, {choices: installed.hosts, required: true})

  .iterate('hosts', async (host) => {

	  const chat = program.chat

	  await chat.notify(`\nStarting cachebust for ${host}`)

	  const DEST = `/home/dopamine/bin/config`
	  const cdn = await program.ssh(cfg.getHost(host).ip, 'dopamine')
	  await cdn.chdir(DEST)
	  const config = JSON.parse(await cdn.exec('cat .config.json', { secret: true }))
	  const apiKey = config.platform.launcherApiKey


	  let operators = cfg.operators.filter(operator => operator.cdn === host)
	  let requests = []
	  if(!operators.length) return console.warn(`No operators found for host: ${host}`)

	  for (const operator in operators) {
		  let url = `https://gserver-${operator.dir}.${operator.domain}/${operator.dir}/launcher/cachebust`
		  requests.push(await cachebust(url, apiKey))
	  }

	  //TODO This will exit when a cachebust fails for a single host
	  if(requests && requests.find((request) => request.error !== null)){
		  await chat.notify(`\nThere was a problem with the cachebust. Please investigate!`)
		  throw Error('There was a problem with the cachebust. Please investigate!')
	  }

  })
