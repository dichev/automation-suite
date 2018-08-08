#!/usr/bin/env node
'use strict';


const Program = require('dopamine-toolbox').Program
const cfg = require('configurator')
const pad = (str, width) => str + ' '.repeat(Math.max(0, width - str.length))

let program = new Program({ chat: cfg.chat.rooms.devops })
program
    .description(`Auto sync dns records for all host names in to the office DNS server.`)
    .run(async () => {
        let records = `# Automatically generated, please do not edit\n\n`
        let hosts = Object.keys(cfg.hosts).sort()
        for(let host of hosts) records += pad(cfg.hosts[host].ip, 15) + ' ' + host + '.out\n'
        console.log(records)
    
        console.log('\nWriting all records to: `/etc/db.resolv.conf`')
        let dns = await program.ssh(cfg.hosts['office-dns'].ip, 'root')
        await dns.writeFile(`/etc/db.resolv.conf`, records)
        await dns.exec(`/etc/init.d/dnsmasq reload`)
        await dns.exec(`rndc flush internal`)
        
        console.log('Done')
        await program.shell().exec(`node office/dns/check`)
        console.log('Note usually it takes 5 minutes to be clear the DNS cache ')
    })
