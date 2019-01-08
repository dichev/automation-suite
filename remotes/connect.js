#!/usr/bin/env node
'use strict';

const SSHClient = require('dopamine-toolbox').SSHClient
const cfg = require('configurator')
const inquirer = require('inquirer')
const Servers = Object.keys(cfg.hosts)

inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'))

let ServersFilter = function(answersSoFar,input){
    input = input || '';
    let ServersFiltered = Servers.filter(el => el.indexOf(input) > -1 )
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