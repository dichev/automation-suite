#!/usr/bin/env node
'use strict';

/**
 * Usage:
 * $ node servers/servers-conf/update --locations=belgium
 * $ node servers/servers-conf/update --locations=belgium --reload nginx
 * $ node servers/servers-conf/update --locations=belgium --reload webs
 * $ node servers/servers-conf/update --locations=belgium --rev=426c9217
 * $ node servers/servers-conf/update --locations=belgium --interval 10
 */

const Program = require('dopamine-toolbox').Program
const cfg = require('configurator')


let program = new Program({ chat: cfg.chat.rooms.devops })
program
    .description('Auto update sever configurations by reloading one by one each server')
    
    .option('-l, --locations <list|all>', 'The target host name', {choices: Object.keys(cfg.locations), required: true})
    .option('-r, --rev <string>', 'Specify target git revision, very useful for rollback. Default reset to origin/master')
    .option('-i, --interval <int>', 'How many seconds to wait between each configuration switch. Default is 2')
    .option('-f, --force', 'Skip manual changes validations and proceed on your risk')
    .option('--no-wait-webs', 'Skip waiting for active php processes to end and other safety delays. WARNING: this will break current php processes in the middle of their execution causing strange errors.')
    .option('--reload <nginx|webs|nginx-with-upgrade>', 'Reload nginx service or webs php-fpm', { choices: ['nginx','webs','nginx-with-upgrade']})
    
    
//TODO: no mysql!
program
    .iterate('locations', async (location) => {
        const params = program.params
        const INTERVAL = params.interval !== undefined ? parseInt(params.interval) : 2
        const REVISION = params.rev || 'origin/master'
        
        const RELOAD_NGINX = params.reload === 'nginx' || params.reload === 'webs'
        const RELOAD_NGINX_WITH_UPGRADE = params.reload === 'nginx-with-upgrade'
        const RELOAD_WEBS = params.reload === 'webs'
        
        const NO_WAIT = params.waitWebs === false // default: true
        const REPO = '/opt/servers-conf'
    
        
        let hosts = []
        hosts.push({ type: 'lb', 'name': 'lb', ssh: await program.ssh(cfg.locations[location].hosts.lb, 'root')})
        for(let web of cfg.locations[location].hosts.webs){
            hosts.push({ type: 'web', name: web.name, ssh: await program.ssh(web.ip, 'root') })
        }
        for(let database of cfg.locations[location].hosts.databases){
            let db = cfg.databases[database]
            if(db.master)                              hosts.push({ type: 'mysql', name: 'master',  ssh: await program.ssh(db.master, 'root') })
            if(db.slave && db.slave !== db.master)     hosts.push({ type: 'mysql', name: 'slave',   ssh: await program.ssh(db.slave, 'root') })
            if(db.archive && db.archive !== db.master) hosts.push({ type: 'mysql', name: 'archive', ssh: await program.ssh(db.archive, 'root') })
        }
       
        
        console.info('\n1) Ensure there are no manual configs')
        if (!program.params.force) {
            for (let host of hosts) {
                console.log(host.name + '..')
                let changes = await host.ssh.exec(`cd ${REPO} && git status --short --untracked-files=no`)
                if (changes) throw Error(`Aborting.. Manual changes found at ${host.name}`)
            }
            
        } else {
            console.log('Skipping (forced)')
        }
    
        console.info('\n2) Fetching all configurations (nginx/php-fpm)')
        console.log(hosts.map(h=>h.name).join(',') + '.. (parallel)')
        await Promise.all(hosts.map(host => host.ssh.exec(`cd ${REPO} && git fetch --prune && git reset --hard ${REVISION}`)))
    
    
        
        
        console.info('\n3) Reload config changes')
        if(!program.reload) console.log('nothing set to be reloaded')
        let lb = hosts.find(host => host.type === 'lb')
        let webs = hosts.filter(host => host.type === 'web')
        
        if(RELOAD_NGINX) {
            console.log('\n# Reloading configuration of nginx..')
            await lb.ssh.exec(`nginx -s reload`)
        }
        
        if(RELOAD_NGINX_WITH_UPGRADE){
            console.log('\n# Reloading configuration of nginx with UPGRADE..')
            await lb.ssh.exec(`nginx_reload_upgrade.sh`)
        }
        
        if (RELOAD_WEBS) {
            if (NO_WAIT) {
                console.log(`\n\n# Reloading configuration of all webs (in parallel)`)
                await Promise.all(webs.map(web => web.ssh.exec(`systemctl restart php-fpm`)))
            } else {
                await program.sleep(INTERVAL, `Ready. Waiting between operations`)
                for (let web of webs) {
                    console.log(`\n\n# [${web.name}] Reloading configuration..`)
                    await lb.ssh.exec(`switch-webs --operators=all --webs=all --exclude-webs=${web.name} --quiet`)
                    await web.ssh.exec(`systemctl restart php-fpm`)
                    console.log('Checking is php-fpm process active..')
                    await web.ssh.exec(`sleep 1 && systemctl is-active php-fpm `) // exits with 1 if the process is inactive
                    await program.sleep(INTERVAL, `Ready. Waiting between operations`)
                }
                await lb.ssh.exec(`switch-webs --operators=all --webs=all --quiet`)
            }
        }
        console.log('Ready')
  
    })
