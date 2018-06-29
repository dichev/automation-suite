#!/usr/bin/env node
'use strict';

/**
 * Usage:
 * $ node bin/sys-metrics/init --host dev-hermes-web1
 * $ node bin/sys-metrics/init --host *-web* //TODO support this
 */


let Deployer = require('deployer2')
let deployer = new Deployer()
const installed = require('./.installed.json')

deployer
    .option('-h, --host <name>', 'The target host name (all hosts are predefined in deployer configuration)')
   
    .run(async () => {
		let ssh = await deployer.ssh(deployer.params.host, 'root')
		
		await ssh.exec('ssh-keyscan -H soft-build.d >> ~/.ssh/known_hosts ')
		await ssh.exec('rsync -av soft-build.d:/opt/phpbrew /opt/');
		/* LINKS */
		await ssh.exec('rm /etc/alternatives/php && ln -s /opt/phpbrew/php/php/bin/php /etc/alternatives/php')
		await ssh.exec('rm /etc/init.d/php-fpm && ln -s /opt/servers-conf/php/php-fpm.init.d /etc/init.d/php-fpm')
		await ssh.exec('rm /etc/logrotate.d/php*-fpm && ln -s /opt/servers-conf/php/logrotate /etc/logrotate.d/php-fpm')
		await ssh.exec(`rm /opt/phpbrew/php/php ln -s /opt/phpbrew/php/php-${installed.version} /opt/phpbrew/php/php`) /* kade moje se definira naj-dobre default versiqta na php */
    })

