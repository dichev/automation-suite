#!/usr/bin/env node
'use strict';

const SSHClient = require('dopamine-toolbox').SSHClient
const cfg = require('configurator')
const inquirer = require('inquirer')
const Servers = Object.keys(cfg.hosts)

inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'))
const initialFilter = process.argv[2] || ''

let ServersFilter = (answersSoFar,input) => {
    input = input || initialFilter;
    let ServersFiltered = Servers.filter(el => el.match(new RegExp(input,'i')) )
    return new Promise(resolve => resolve(ServersFiltered) );
}

inquirer
    .prompt([
        {
            type: 'autocomplete',
            name: 'host',
            message: 'Please select a server?',
            source: ServersFilter,
        }
    ])
    .then(async answers => {
        console.log(answers)
        let ssh = await new SSHClient().connect({host: cfg.getHost(answers.host).ip, username: 'root'})
        await ssh.shell()
        await ssh.disconnect()
    });