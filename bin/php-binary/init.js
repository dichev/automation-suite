#!/usr/bin/env node
'use strict';

/**
 * Usage:
 * $ node bin/sys-metrics/init --host dev-hermes-web1
 * $ node bin/sys-metrics/init --host *-web* //TODO support this
 */


const Deployer = require('deployer2')
const installed = require('./.installed.json')
const cfg = require('configurator')
let deployer = new Deployer(cfg.devops)

deployer

    .option('-h, --hosts <list|all>', 'The target host name', {choices: installed.hosts})
    .option('-p, --phpversion <version>', 'The php version number', {choices: installed.versions, def: '7.1.19'})
    .loop('hosts')

    .run(async (host) => {
        let ssh = await deployer.ssh(cfg.hosts.get(host).ip, 'root')
	console.info('info: ' + cfg.hosts.get(host).network)
	var SoftBuild = (cfg.hosts.get(host).network == 'office' ? "192.168.100.19" : "192.168.110.19");
	console.info('info:' + SoftBuild)
		await ssh.exec('ssh-keyscan -H '+SoftBuild+' >> ~/.ssh/known_hosts ')
		await ssh.exec('mkdir -p /opt/phpbrew; rsync -av '+SoftBuild+':/opt/phpbrew/php /opt/phpbrew/') /*test only */
		await ssh.exec('cd /opt/servers-conf && git pull')
		/* LINKS */
		
		await ssh.exec(`rm /opt/phpbrew/php/php && ln -s /opt/phpbrew/php/php-${installed.version} /opt/phpbrew/php/php`)
		await ssh.exec('rm /opt/phpbrew/php/php/etc/php.ini && ln -s /opt/servers-conf/php/php.ini /opt/phpbrew/php/php/etc/php.ini')
		await ssh.exec('rm /usr/bin/php && ln -s /opt/phpbrew/php/php/bin/php /usr/bin/php')
		await ssh.exec('rm /etc/init.d/php-fpm && ln -s /opt/servers-conf/php/php-fpm.init.d /etc/init.d/php-fpm')
		await ssh.exec('rm /lib/systemd/system/php*-fpm.service && ln -s /opt/servers-conf/php/php-fpm.service /lib/systemd/system/php-fpm.service')
		await ssh.exec('rm /etc/logrotate.d/php*-fpm && ln -s /opt/servers-conf/php/logrotate /etc/logrotate.d/php-fpm')
		await ssh.exec('/etc/init.d/php5-fpm stop') //ps za kill
		await ssh.exec('/etc/init.d/php7-fpm stop')
		await ssh.exec('/etc/init.d/php-fpm stop')
		await ssh.exec('/etc/init.d/php-fpm start') //system
    })

