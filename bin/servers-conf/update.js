#!/usr/bin/env node
'use strict';

/**
 * Usage:
 * $ node bin/servers-conf/update --locations=belgium
 * $ node bin/servers-conf/update --locations=belgium --only-nginx
 * $ node bin/servers-conf/update --locations=belgium --rev=426c9217
 * $ node bin/servers-conf/update --locations=belgium --interval 10
 */

const Program = require('dopamine-toolbox').Program
const cfg = require('configurator')


let program = new Program({ chat: cfg.chat.rooms.devops })
program
    // .usage('[--rev <string> --interval <int> --force --only-nginx --no-wait --with-nginx-upgrade]')
    .description('Auto update sever configurations by reloading one by one each server')
    
    .option('-l, --locations <list|all>', 'The target host name', {choices: Object.keys(cfg.locations), required: true})
    .option('-r, --rev <string>', 'Specify target git revision, very useful for rollback. Default reset to origin/master')
    .option('-i, --interval <int>', 'How many seconds to wait between each configuration switch. Default is 2')
    .option('-f, --force', 'Skip manual changes validations and proceed on your risk')
    .option('--no-wait', 'Skip waiting for active php processes to end and other safety delays. WARNING: this will break current php processes in the middle of their execution causing strange errors.')
    .option('--only-nginx', 'Update all configurations but restarts only the nginx service (so php-fpm will be not updated)')
    .option('--with-nginx-upgrade', 'Update all configurations but restarts only the nginx service USING UPGRADE method (so php-fpm will be not updated)')
    
    

program
    .iterate('locations', async (location) => {
        const params = program.params
        const INTERVAL = params.interval !== undefined ? parseInt(params.interval) : 2
        const REVISION = params.rev || 'origin/master'
        const ONLY_NGINX = params.onlyNginx === true // default: false
        const WITH_NGINX_UPGRADE = params.withNginxUpgrade === true // default: false
        const NO_WAIT = params.wait === false // default: true
        const REPO = '/opt/servers-conf'
    
        
        let hosts = cfg.locations[location].hosts
        let lb = await program.ssh(hosts.lb, 'root')
        let webs = []
        for(let name in hosts){
            if(!name.startsWith('web')) continue;
            webs.push({ name: name, ssh: await program.ssh(hosts[name], 'root') })
        }
        
    
        console.info('\n1) Ensure there are no manual configs')
        if (!program.params.force) {
            console.log('nginx..')
            let changes = await lb.exec(`cd ${REPO} && git status --short --untracked-files=no`)
            if (changes) throw Error(`Aborting.. Manual changes found at load balancer`)
            for (let web of webs) {
                console.log(web.name + '..')
                changes = await web.ssh.exec(`cd ${REPO} && git status --short --untracked-files=no`)
                if (changes) throw Error(`Aborting.. Manual changes found at ${web.name}`)
            }
        } else {
            console.log('Skipping (forced)')
        }
    
    
        console.info('\n2) Fetching all configurations (nginx/php-fpm)')
        console.log('nginx..')
        await lb.exec(`cd ${REPO} && git fetch --prune && git reset --hard ${REVISION}`)
        console.log(webs.map(w=>w.name).join(',') + '.. (parallel)')
        await Promise.all(webs.map(web => web.ssh.exec(`cd ${REPO} && git fetch --prune && git reset --hard ${REVISION}`)))
        
    
        console.info('\n3) Reload config changes')
        if (!WITH_NGINX_UPGRADE) {
            console.log('\n# Reloading configuration of nginx..')
            await lb.exec(`nginx -s reload`)
        } else {
            console.log('\n# Reloading configuration of nginx with UPGRADE..')
            await lb.exec(`nginx_reload_upgrade.sh`)
        }
        if (!ONLY_NGINX) {
            if (NO_WAIT) {
                console.log(`\n# Reloading configuration of all webs (in parallel)`)
                await Promise.all(webs.map(web => web.ssh.exec(`systemctl restart php-fpm`)))
            } else {
                await program.sleep(INTERVAL, `Ready. Waiting between operations`)
                for (let web of webs) {
                    console.log(`\n# Reloading configuration of ${web.name}..`)
                    await lb.exec(`switch-webs --operators=all --webs=all --exclude-webs=${web.name} --quiet`)
                    await web.ssh.exec(`systemctl restart php-fpm`)
                    console.log('Checking is php-fpm process active..')
                    await web.ssh.exec(`sleep 1 && systemctl is-active php-fpm `) // exits with 1 if the process is inactive
                    await program.sleep(INTERVAL, `Ready. Waiting between operations`)
                }
                await lb.exec(`switch-webs --operators=all --webs=all --quiet`)
            }
        }
        console.log('Ready')
  
    })
