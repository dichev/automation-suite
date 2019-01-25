#!/usr/bin/env node
'use strict';

process.argv.push('--parallel')
process.argv.push('--quiet')

const clui = require('clui')
const clc = require('cli-color')
const Program = require('dopamine-toolbox').Program
const SSHClient = require('dopamine-toolbox').SSHClient
const cfg = require('configurator')
const inquirer = require('inquirer')
const Sparkline = clui.Sparkline;
const Gauge = clui.Gauge;
const Line = clui.Line;
const cliProgress = require('cli-progress')
inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'))

let Menu = []

let ServersFilter = (answersSoFar,input) => {
    input = input || '';
    let ServersFiltered = Menu.filter(el => (el.split(' ').filter(a=>a))[1].match(new RegExp(input,'i')) )
    return new Promise(resolve => resolve(ServersFiltered) );
}

const bar = new cliProgress.Bar({clearOnComplete:true}, cliProgress.Presets.shades_classic)
let iterator = 0
let program = new Program({quiet:true })

inquirer.prompt([{
    name: 'Metrics',
    type: 'checkbox',
    message: "What to look for",
    Cpu:1,
    choices: [
            {name: 'Cpu',checked: true},
            {name: 'Mem',checked:true},
            {name: 'Load'},
            {name: 'Fpm'},
            {name: 'SQL',checked:true},
            {name: 'Time'}
        ],
    validate: function(answer) {
        return true;
    }
}]).then(async (answer) => {

    let Metrics = answer.Metrics
    let hasMem  = (Metrics.indexOf('Mem')  > -1)
    let hasCpu  = (Metrics.indexOf('Cpu')  > -1)
    let hasFpm  = (Metrics.indexOf('Fpm')  > -1)
    let hasSql  = (Metrics.indexOf('SQL')  > -1)
    let hasLoad = (Metrics.indexOf('Load') > -1)
    let hasTime = (Metrics.indexOf('Time') > -1)

    program
        .description('Show server stats')
        .option('-h, --hosts <list|all>', 'The target host name', {choices: Object.keys(cfg.hosts), required: true})
    program
        .iterate('hosts', async (host) => {

            try{
                let memInfo = ''
                let ssh = await new SSHClient().connect({host: cfg.hosts[host].ip, username: 'root'},{silent:true})
                let procs,mem,cpu,time,uptime,sqlStats = false
                if(hasMem){
                    mem = await ssh.exec("free | grep Mem | awk '{print $3/$2 * 100.0}' | cut -d'.' -f1",{silent:true})
                    memInfo = await ssh.exec("free -h | grep ^Mem | awk '{print $3\"/\"$2}'",{silent:true})
                }
                if(hasCpu)  cpu = await ssh.exec("top -bn 1 | awk -v np=`nproc` 'NR>7{s+=$9} END {print s/np}' | cut -d'.' -f1",{silent:true})
                if(hasLoad) uptime = (await ssh.exec("cat /proc/loadavg | cut -d' ' -f1,2,3",{silent:true})).split(' ').reverse()
                if(hasFpm)  procs = await ssh.exec("ps -xauw | grep fpm | grep -v grep | wc -l",{silent:true})
                if(hasSql)  sqlStats = await ssh.exec("mysqladmin status 2>&1 | awk -F\" \" '{printf \"[%4d /%7d]\", $4,$NF}' ",{silent:true})
                if(hasTime) time = await ssh.exec("date +%H-%M-%S",{silent:true})

                let line = new Line().padding(2)
                    line.column((iterator + 1) + ')', 5)
                    line.column(host, 35)
                    line.column(cfg.hosts[host].ip,18)
                if(hasMem)  line.column(Gauge(mem, 100, 11, 90,(mem + '%').padEnd(4,' ') + memInfo), 30, [clc.white])
                if(hasCpu)  line.column(Gauge(cpu, 100, 11, 90,cpu + '%'), 20, [clc.white])
                if(hasFpm)  line.column(procs, 5, [clc.yellow])
                if(hasSql)  line.column(sqlStats, 15)
                if(hasLoad) line.column(Sparkline(uptime,' load'),30,[clc.yellow])
                if(hasTime) line.column(time,10,[clc.yellow])

                let content = line.contents();
                Menu.push(content)
                await ssh.disconnect()
            }catch(e){ }

            iterator++
            bar.start(program.params.hosts.split(',').length,iterator)

        }).then(()=>{

            bar.stop();
            let line = new Line()
            line.padding(2)
            line.column('No:', 5, [clc.cyan])
            line.column('Host:', 35, [clc.cyan])
            line.column('ip:', 18, [clc.cyan])
            if(hasMem)  line.column('Mem:', 30, [clc.cyan])
            if(hasCpu)  line.column('Cpu:', 20, [clc.cyan])
            if(hasFpm)  line.column('Fpm:', 5, [clc.cyan])
            if(hasSql)  line.column('Sql conn / qry:', 15, [clc.cyan])
            if(hasLoad) line.column('LoadAvg:', 30, [clc.cyan])
            if(hasTime) line.column('Time (UTC)', 10, [clc.cyan])

            line.fill()
            line = line.contents();
            let pageSize = (iterator < process.stdout.rows ? iterator : process.stdout.rows ) - 5
            inquirer.prompt([{
                name: 'Server',
                type: 'autocomplete',
                message: line ,
                source: ServersFilter,
                pageSize:pageSize < 5 ? 5 : pageSize
            }]).then(async (answers) => {
                let server = (answers.Server.split(' ').filter(a => a))[1];
                let ssh = await new SSHClient().connect({host: cfg.getHost(server).ip, username: 'root'})
                await ssh.shell()
                await ssh.disconnect()
            });
    })

})