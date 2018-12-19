#!/usr/bin/env node
'use strict';

// TODO: this script is deprecated but still used. In future it will gather information from the elastic monitoring

const Program = require('dopamine-toolbox').Program
const SSHClient = require('dopamine-toolbox').SSHClient
const cfg = require('configurator')
const CloudFlare = require('dopamine-toolbox').plugins.CloudFlare
const rnd = (min, max) => Math.random() * (max - min) + min

const MARKER  = '[auto] settings bot'
const DELAY_MIN = 5 // minutes
const DELAY_MAX = 15 // minutes
const THRESHOLD = 10

let program = new Program({chat: cfg.chat.rooms.anomaly })

program
    .description(`Auto Block the "JP Displayer bot" for fun - will be banned NOT immediately but in random periods between ${DELAY_MIN}m - ${DELAY_MAX}m just to look like human action`)
    
    .run(async function script() {
        
        // Retrieve currently banned ips
        console.log('Retrieve currently banned ips')
        const zones = [
            cfg.cloudflare.zones['tgp.cash'],
            cfg.cloudflare.zones['redtiger.cash']
        ]
        
        for(let z of zones) {
            console.log('\n\n#Checking zone ' + z.domain)
    
            let cf = new CloudFlare(z.zone, z.email, z.key)
            cf.silent = true
            let res = await cf.get('firewall/access_rules/rules?mode=block')
            let rules = res.result.filter(rule => rule.notes === MARKER && rule.mode === 'block')
            let bannedIps = rules.map(rule => rule.configuration.value)
            cf.silent = false
            console.log('- Found', bannedIps)
    
    
            // Remove old banned ips (one days ago)
            console.log('Remove old banned ips (one days ago)')
            for (let rule of rules) {
                let oneDaysAgo = new Date()
                oneDaysAgo.setTime(oneDaysAgo.getTime() - (24 * 60 * 60 * 1000))
                if (new Date(rule.created_on) < oneDaysAgo) {
                    await program.chat.message(`Remove the ban of ${rule.configuration.value} (added on ${rule.created_on}`)
                    await program.confirm(`Do you want to remove the ban of ${rule.configuration.value} (added on ${rule.created_on})`)
                    await cf.delete('firewall/access_rules/rules/' + rule.id)
                }
            }
    
    
            // Check is there a JP bot
            console.log('Check is there a JP bot')
    
    
            let ips = []
            let conditions = [ // NOTE: these must be VERY specific conditions to avoid false bans
                `tail -n 5000 /var/log/nginx/access.log | grep "platform/game/settings" | awk '{print $1}' | sort -n | uniq -c | sort -nr | head -20`,
                `tail -n 1000 /var/log/nginx/error.log | grep "Jackpot feed requested for game without" | egrep -o 'client: [0-9\\.]+' | awk '{print $2}' | sort -n | uniq -c | sort -nr | head -20`,
            ]
            
            for(let host of ['belgium-mga-lb1', 'belgium-alderney-lb1']) {
                let ssh = await new SSHClient().connect({username: 'root', host: cfg.getHost(host).ip})
                for (let cmd of conditions) {
                    let logs = await ssh.exec(cmd, {silent: true})
                    for (let line of logs.split('\n')) {
                        let [cnt, ip] = line.trim().split(' ')
                        if (parseInt(cnt) >= THRESHOLD) {
                            console.log(` - Found JP bot with ${cnt} settings requests ip ${ip}`)
                            ips.push(ip)
                        }
                    }
                }
                await ssh.disconnect()
            }
    
            console.log('Found:' + ips)
    
            // Ban the bot
            if (ips.length) {
                console.log('Ban the bot')
                for (let ip of ips) {
                    if (bannedIps.includes(ip)) {
                        console.log(`- WARNING! Already banned ${ip}`)
                    } else {
                        console.log(`- Ban ${ip}`)
                
                        await program.chat.message(`Found "JP Displayer" bot! Banning ${ip} for ${z.domain} domain`)
                        await program.confirm('Are u sure?')
                        await cf.post('firewall/access_rules/rules', {
                            mode: 'block',
                            configuration: {
                                target: 'ip',
                                value: ip
                            },
                            notes: MARKER
                        })
                    }
                }
            }
    
        }
    
        // Rerun
        let delay = parseInt(rnd(DELAY_MIN, DELAY_MAX))
        console.log(`\n== rerun after ${delay}m == \n`)
        await program.sleep(delay * 60)
        return await script()
        
    })
