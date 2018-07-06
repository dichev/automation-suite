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
let deployer = new Deployer()

deployer

    .option('-h, --hosts <list|all>', 'The target host name', {choices: installed.hosts})
    .option('-p, --phpversion <version>', 'The php version number', {choices: installed.versions, def: intsalled.version})
    .loop('hosts')

    .run(async (host) => {

    	let h = cfg.hosts[host]
        let hostsList = cfg.locations[h.location].hosts
        console.log(hostsList.lb)
        let sshlb = await deployer.ssh(hostsList.lb, 'root')
        console.log(h.alias)
        let swc =Object.keys(hostsList)
                 	.filter(key => key.startsWith('web'))
                 	.filter(key => key !== h.alias)
                  	.join(",")
        let switcha = 'switch-webs --operators=all --webs=' + swc
        console.log(switcha)
        await sshlb.exec(switcha)
        
        let ssh = await deployer.ssh(cfg.hosts.get(host).ip, 'root')
		var SoftBuild = (cfg.hosts.get(host).network == 'office' ? "192.168.100.19" : "192.168.110.19");
		await ssh.exec('ssh-keyscan -H '+SoftBuild+' >> ~/.ssh/known_hosts ')
		await ssh.exec('mkdir -p /opt/phpbrew; rsync -av '+SoftBuild+':/opt/phpbrew/php /opt/phpbrew/')
		await ssh.exec('cd /opt/servers-conf && git pull')
		// LINKS
		await ssh.exec(`rm /opt/phpbrew/php/php && ln -s /opt/phpbrew/php/php-${version} /opt/phpbrew/php/php`)
		await ssh.exec('rm /opt/phpbrew/php/php/etc/php.ini && ln -s /opt/servers-conf/php/php.ini /opt/phpbrew/php/php/etc/php.ini')
		await ssh.exec('rm /usr/bin/php && ln -s /opt/phpbrew/php/php/bin/php /usr/bin/php')
		await ssh.exec('rm /etc/init.d/php-fpm && ln -s /opt/servers-conf/php/php-fpm.init.d /etc/init.d/php-fpm')
		await ssh.exec('rm /lib/systemd/system/php*-fpm.service && ln -s /opt/servers-conf/php/php-fpm.service /lib/systemd/system/php-fpm.service')
		await ssh.exec('rm /etc/logrotate.d/php*-fpm && ln -s /opt/servers-conf/php/logrotate /etc/logrotate.d/php-fpm')
		await ssh.exec('sleep 10; killall -9 php-fpm')
		await ssh.exec('systemctl restart php-fpm') //system
		
        await sshlb.exec('switch-webs --operators=all --webs=all')
    })

