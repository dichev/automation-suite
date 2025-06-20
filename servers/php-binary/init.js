#!/usr/bin/env node
'use strict';

/**
 * Usage:
 * $ node servers/php-binary/init --hosts dev-hermes-web1
 * $ node servers/php-binary/init --hosts *-web*
 */


const Program = require('dopamine-toolbox').Program
const cfg = require('configurator')

const SoftBuild = '192.168.100.19'
const PHP_VERSION = '7.1.20'
const HOSTS = Object.keys(cfg.hosts).filter(h => h.includes('-web'))

let program = new Program({ chat: cfg.chat.rooms.devops })

program
    .option('-h, --hosts <list|all>', 'The target host name', {choices: HOSTS, required: true})
    
    .iterate('hosts', async (host) => {
        
        let h = cfg.hosts[host]
        let IP = h.ip
        let hosts = cfg.locations[h.location].hosts
        let sshlb = await program.ssh(hosts.lb, 'root')
        
        await sshlb.exec('switch-webs --quiet --webs=all --operators=all --exclude-webs=' + hosts.webs.find(w => w.ip === IP).name)
        
        let ssh = await program.ssh(IP, 'root')
        
        //await ssh.exec('ssh-keyscan -H '+SoftBuild+' >> ~/.ssh/known_hosts ')
        await ssh.exec('apt-get -qq update && apt-get -qq install libxslt1.1 libreadline7 -y')
        await ssh.exec('ssh -o StrictHostKeyChecking=no ' + SoftBuild + ' uptime') /* da se pomisli po-elegantno */
        await ssh.exec('mkdir -p /opt/phpbrew; rsync -av --delete ' + SoftBuild + ':/opt/phpbrew/php /opt/phpbrew/')
        await ssh.exec('mkdir -p /var/log/php') // used for cli error logs
        await ssh.exec('cd /opt/servers-conf && git pull')
        
        // LINKS
        console.log("php version: " + PHP_VERSION)
        await ssh.exec(`rm -fv /opt/phpbrew/php/php && ln -s /opt/phpbrew/php/php-${PHP_VERSION} /opt/phpbrew/php/php`)
        await ssh.exec('rm -fv /opt/phpbrew/php/php/etc/php.ini && ln -s /opt/servers-conf/php/php.ini /opt/phpbrew/php/php/etc/php.ini')
        await ssh.exec('rm -fv /usr/bin/php && ln -s /opt/phpbrew/php/php/bin/php /usr/bin/php')
        await ssh.exec('rm -fv /etc/init.d/php*-fpm && ln -s /opt/servers-conf/php/php-fpm.init.d /etc/init.d/php-fpm')
        await ssh.exec('rm -fv /etc/systemd/system/php*-fpm.service && systemctl enable /opt/servers-conf/php/php-fpm.service')
        await ssh.exec('sleep 2; killall -9 php-fpm || killall -9 php5-fpm || true')
        await ssh.exec('systemctl restart php-fpm && sleep 1') //system

        await program.shell().exec(`node servers/php-binary/check --hosts ${host}`)
        
        await sshlb.exec('switch-webs --quiet --operators=all --webs=all')
    })

