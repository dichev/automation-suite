#!/usr/bin/env node
'use strict';


const Program = require('dopamine-toolbox').Program
const cfg = require('configurator')
let program = new Program({ chat: cfg.chat.rooms.devops })


program
    .description('Setup dnsmasq configuration of the webs')
    .option('-h, --hosts <list|all>', 'The target host names', { choices: Object.keys(cfg.hosts), required: true })
    
    .iterate('hosts', async (host) => {
        let root = await program.ssh(cfg.getHost(host).ip, 'root')
        let location = cfg.getHost(host).location

        console.log('Verify dnsmsaq is installed and active')
        await root.exec('dnsmasq --version && systemctl is-active dnsmasq')
        
        await root.exec('echo "nameserver 127.0.0.1" > /etc/resolv.conf')
        await root.exec('echo "nameserver 1.1.1.1" >> /etc/resolv.conf')
    
        let operators = Object.values(cfg.operators).filter(o => o.location === location)
        for (let operator of operators) {
            await root.exec(`cat /etc/resolv.conf > /home/dopamine/production/${operator.dir}/etc/resolv.conf`) // keeps file permissions
        }
        
        await root.exec(`mv -v /etc/dnsmasq.d /etc/dnsmasq.d.backup-${Date.now()}`)
        await root.exec('ln -sv /opt/servers-conf/dns/dnsmasq.d /etc/dnsmasq.d')
        
        await root.exec('rm -fv /etc/resolv.dnsmasq.conf')
        await root.exec('ln -sv /opt/servers-conf/dns/resolv.dnsmasq.conf /etc/resolv.dnsmasq.conf')
        
        await root.exec('dnsmasq --test && /etc/init.d/dnsmasq restart')
        let res = await root.exec('dig dopamine.bg | grep "SERVER: "')
        if(!res.startsWith(';; SERVER: 127.0.0.1')) throw Error(`Can't detect dnsmasq usage, please investigate`)
        
        console.log('Success')
    })

