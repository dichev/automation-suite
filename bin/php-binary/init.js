#!/usr/bin/env node
'use strict';

/**
 * Usage:
 * $ node bin/php-binary/init --hosts dev-hermes-web1
 * $ node bin/php-binary/init --hosts *-web*
 */


const Deployer = require('deployer2')
const installed = require('./.installed.json')
const cfg = require('configurator')
let deployer = new Deployer()

deployer

    .option('-h, --hosts <list|all>', 'The target host name', {choices: installed.hosts})
    .option('-p, --phpversion <version>', 'The php version number', {choices: installed.versions, def: installed.version})
    .loop('hosts')

    .run(async (host) => {

    	let h = cfg.hosts[host]
        let hostsList = cfg.locations[h.location].hosts
        let sshlb = await deployer.ssh(hostsList.lb, 'root')
        
        await sshlb.exec('switch-webs --quiet --webs=all --operators=all --exclude-webs=' + h.alias)
        
        let ssh = await deployer.ssh(cfg.getHost(host).ip, 'root')
		let SoftBuild = (cfg.getHost(host).network === 'office' ? "192.168.100.19" : "192.168.110.19");
		//await ssh.exec('ssh-keyscan -H '+SoftBuild+' >> ~/.ssh/known_hosts ')
		await ssh.exec('ssh -o StrictHostKeyChecking=no ' +SoftBuild + ' uptime') /* da se pomisli po-elegantno */
		await ssh.exec('mkdir -p /opt/phpbrew; rsync -av '+SoftBuild+':/opt/phpbrew/php /opt/phpbrew/')
		await ssh.exec('cd /opt/servers-conf && git pull')
		// LINKS
		console.log("php version: "+deployer.params.phpversion)
		await ssh.exec(`rm /opt/phpbrew/php/php && ln -s /opt/phpbrew/php/php-${deployer.params.phpversion} /opt/phpbrew/php/php`)
		await ssh.exec('rm /opt/phpbrew/php/php/etc/php.ini && ln -s /opt/servers-conf/php/php.ini /opt/phpbrew/php/php/etc/php.ini')
		await ssh.exec('rm /usr/bin/php && ln -s /opt/phpbrew/php/php/bin/php /usr/bin/php')
		await ssh.exec('rm /etc/init.d/php-fpm && ln -s /opt/servers-conf/php/php-fpm.init.d /etc/init.d/php-fpm')
		await ssh.exec('rm /lib/systemd/system/php*-fpm.service && ln -s /opt/servers-conf/php/php-fpm.service /lib/systemd/system/php-fpm.service')
		await ssh.exec('rm /etc/logrotate.d/php*-fpm && ln -s /opt/servers-conf/php/logrotate /etc/logrotate.d/php-fpm')
		await ssh.exec('sleep 10; killall -9 php-fpm')
		await ssh.exec('systemctl restart php-fpm') //system
		
        await sshlb.exec('switch-webs --quiet --operators=all --webs=all')
		
		await deployer.exec(`node bin/php-binary/check --hosts ${host}`)
    })

