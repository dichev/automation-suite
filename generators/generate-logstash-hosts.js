#!/usr/bin/env node
'use strict';

const cfg = require('configurator')
const fs = require('fs')
const path = require('path')
const Program = require('dopamine-toolbox').Program
const NEW_LINE = '\r\n'; //require('os').EOL

let program = new Program()

const save = async (file, content) => {
    console.log(file)
    let dir = path.dirname(file).replace(/\\/g, '/')
    if (!fs.existsSync(dir)) await program.shell().exec(`mkdir -pv ${dir}`)

    fs.writeFileSync(file, content.replace(/\r?\n/g, NEW_LINE)) // unify new lines
}


let hosts = Object.keys(cfg.hosts)
let hostList = ''
for(let host of hosts) {
    let hostInfo = cfg.getHost(host)
    hostList += `${hostInfo.ip} ${host}\n`
}
const DEST = __dirname + '/output'

save(`${DEST}/logstash/hosts.list`, hostList).then(res => console.log('Success!')).catch(e => console.log(e))

