#!/usr/bin/env node
'use strict';

const Program = require('dopamine-toolbox').Program
const SSHClient = require('dopamine-toolbox').SSHClient
const cfg = require('configurator')
const fs = require('fs')
const path = require('path')

const NEW_LINE = '\r\n'; //require('os').EOL
const DEST = `d:/www/servers/servers-conf-mysql/current`

let program = new Program()
program
    .description('Generate server-conf for specific location')
    .option('-h, --hosts <list|all>', 'The target host name', {choices: Object.keys(cfg.hosts).filter(h => h.includes('sql')), required: true})
    .option('-d, --dest <path>', 'Output generated data to destination path')
    .parse()


const save = async (file, content) => {
    console.log(file)
    let dir = path.dirname(file).replace(/\\/g, '/')
    if (!fs.existsSync(dir)) await program.shell().exec(`mkdir -pv ${dir}`)
    
    fs.writeFileSync(file, content.replace(/\r?\n/g, NEW_LINE)) // unify new lines
}

program
    .iterate('hosts', async (host) => {
        const dest = (program.params.dest || DEST).replace(/\\/g, '/')
        
        let ssh = await new SSHClient().connect({host: cfg.getHost(host).ip, username: 'root'})
        let cnf
        try {
            cnf = await ssh.exec('cat /etc/mysql/conf.d/mysqld-custom.cnf')
            await save(`${dest}/${host}.cnf`, cnf)
        } catch (e) {
            cnf = await ssh.exec('cat /etc/mysql/conf.d/server-custom.cnf || cat conf.d/dope.cnf ||  cat /etc/mysql/my.cnf')
            await save(`${dest}/${host}-NO-REPO.cnf`, cnf)
        }
        
        await ssh.disconnect()
})

