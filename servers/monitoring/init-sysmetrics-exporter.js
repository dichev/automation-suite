#!/usr/bin/env node
'use strict';

const Program = require('dopamine-toolbox').Program
const cfg = require('configurator')
let program = new Program({ chat: cfg.chat.rooms.devops })

program
.description('Setup monitoring: Sysmetrics Exporter')
.option('-h, --hosts <list|all>', 'The target host names', { choices: Object.keys(cfg.hosts), required: true })
.option('-f, --force', 'Skip manual changes validations and proceed on your risk')
.parse()

program.iterate('hosts', async (host) => {
    let hostIP = cfg.getHost(host).ip;

    console.log(`Starting script on HOST:(${host} : ${hostIP})...`)
    await program.chat.notify(`Starting script on HOST:(${host} : ${hostIP})...`)

    let ssh = await program.ssh(cfg.getHost(host).ip, 'root')

    if(await ssh.exists('/opt/dopamine/exporters/sysmetrics_exporter/sysmetrics.service')) {
        await ssh.chdir('/opt/dopamine/exporters/')
        await ssh.exec('git reset --hard')
        await ssh.exec('git pull')

        console.log('App already exist on host. Skipping it...')
    } else {
        // Update project - sysmetrics_exporter
        await ssh.chdir('/opt/dopamine/exporters/')
        await ssh.exec('git reset --hard')
        await ssh.exec('git pull')
        await ssh.chdir('/opt/dopamine/exporters/sysmetrics_exporter')
        await ssh.exec(`echo '{"hostname": "${host}"}' > /opt/dopamine/exporters/sysmetrics_exporter/.hostConf.json`)
        // await ssh.exec('rm -rf /opt/dopamine/exporters/sysmetrics_exporter/node_modules')
        await ssh.exec('npm install')
        await program.sleep(1, 'Waiting a bit just in case');

        await program.chat.notify('Starting sysmetrics_exporter service...')
        await ssh.exec('systemctl enable /opt/dopamine/exporters/sysmetrics_exporter/sysmetrics.service')
        await ssh.exec('systemctl restart sysmetrics.service')

        await program.chat.notify('Success')
    }
    await program.chat.notify('Success')
})
