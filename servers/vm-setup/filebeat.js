#!/usr/bin/env node
'use strict';


const Program = require('dopamine-toolbox').Program
const Tester = require('dopamine-toolbox').Tester
const cfg = require('configurator')
let program = new Program({ chat: cfg.chat.rooms.devops, smartForce: true })
let tester = new Tester()


program
    .description('Setup filebeat log shipper')
    .option('-h, --hosts <list>', 'The target host names', { choices: Object.keys(cfg.hosts), required: true })
    .option('--only-validate', 'Perform just validation of the current filebeat configuration')

    .iterate('hosts', async (host) => {
        let ssh = await program.ssh(cfg.getHost(host).ip, 'root')

        if (! await ssh.exists(`/etc/apt/sources.list.d/elastic-7.x.list`)) {
            await ssh.exec('wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | apt-key add -')
            await ssh.exec('apt-get install -y apt-transport-https')
            await ssh.exec('echo "deb https://artifacts.elastic.co/packages/7.x/apt stable main" | tee -a /etc/apt/sources.list.d/elastic-7.x.list')
        }

        await ssh.exec('apt-get update && apt-get install -y filebeat')

        if (! await ssh.exists(`/opt/servers-conf/filebeat/${host}.yml`)) {
            throw "filebeat config doesnt exists."
        }

        await ssh.exec(`mv /etc/filebeat/filebeat.yml /etc/filebeat/filebeat.yml.back && ln -svf /opt/servers-conf/filebeat/${host}.yml /etc/filebeat/filebeat.yml`)

        if (await ssh.exists(`/etc/rsyslog.d/10-mysql.conf`)) {
            console.log('moving /etc/rsyslog.d/10-mysql.conf to /tmp/10-mysql.conf')
            await ssh.exec(`mv /etc/rsyslog.d/10-mysql.conf /tmp/10-mysql.conf`)
        }
        if (await ssh.exists(`/etc/rsyslog.d/11-nginx.conf`)) {
            console.log('removing /etc/rsyslog.d/11-nginx.conf to /tmp/11-nginx.conf')
            await ssh.exec(`mv /etc/rsyslog.d/11-nginx.conf /tmp/11-nginx.conf`)
        }
        if (await ssh.exists(`/etc/rsyslog.d/12-php.conf`)) {
            console.log('removing /etc/rsyslog.d/12-php.conf to /tmp/12-php.conf')
            await ssh.exec(`mv /etc/rsyslog.d/12-php.conf /tmp/12-php.conf`)
        }

        let it = tester.it
        it(`validate filebeat configuration`, async () => await ssh.exec(`filebeat test config`, {silent: true}))
        it(`validate filebeat output`, async () => await ssh.exec(`filebeat test output`, {silent: true}))
        await tester.run(true)

        await program.confirm('Do you want to load the configurations?')
        await ssh.exec('systemctl restart rsyslog && systemctl restart filebeat')
        await ssh.exec('sleep 1 && systemctl status filebeat | head -n 3')

        console.log('Success')
    })
