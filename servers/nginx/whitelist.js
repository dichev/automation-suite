#!/usr/bin/env node
'use strict';

const Program = require('dopamine-toolbox').Program
const cfg = require('configurator')
const Shell = require('dopamine-toolbox').Shell
const JiraApi = require('jira-client')
const Netmask = require('netmask').Netmask                  // Toolbox ?
const util = require('util')                                // Toolbox ?
const fs = require('fs')
const whois = util.promisify(require('whois').lookup)       // можеби е по-добре да са в туулбокса
const dnsReverse = util.promisify(require('dns').reverse)   // и да се връшат promisify- нати
const RootDir = require('os').tmpdir().replace(/\\/g, '/') + '/dope-'+ Date.now() // windows compatibility
const Econf = {silent:true}
const Url = "https://jira.dopamine.bg/browse"
const now = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')

var jira = new JiraApi(cfg.access.jira);

let program = new Program({ chat: cfg.chat.rooms.devops })
let shell = new Shell()
fs.mkdirSync(RootDir)

// TODO! Maybe add them to toolbox
String.prototype.grep = function(reg){ reg = new RegExp(reg,'i'); return this.split("\n").filter( line => line.match(reg) ).join("\n") }
String.prototype.fromTo = function(from,to){ let tmp = this.substr(this.indexOf(from) + from.length); return tmp.substr(0,tmp.indexOf(to)) }
Array.prototype.unique = function(){ return this.filter( (value,index) => this.indexOf(value) === index  ) }
Array.prototype.duplicates = function(){ return this.filter( value => this.indexOf(value) !== this.lastIndexOf(value)  ).unique() }

program
    .description("Whitelist ips for operator")
    .option('-t, --tasks <list>',`Task to be processed`, {required:true})
    .option('-o, --operator <name>',`Optionally specify the operator name`)
    .option('--reload', 'Reload nginx service')
    .iterate('tasks', async (issueNumber) => {
        console.log(issueNumber)
        let issue = await jira.findIssue(issueNumber);
        let ips = issue.fields.description
            .fromTo('{code:java|title=Required rules*}','{code}')
            .match(/\d+\.\d+\.\d+\.\d+(\/\d+)?/g)

        let operator = program.params.operator || issue.fields.description.fromTo('*Operator:* ',' As described').toLowerCase()
        console.log([operator,ips])

        let me =  await shell.exec('git config user.name',Econf)
        me = me.replace(/\s/g, '')
        let task = issueNumber
        let location = cfg.getLocationByOperator(operator).name
        let gitProject = 'servers-conf-' + location
        let branch = me + '/' +task
        let configFile = `${RootDir}/${gitProject}/nginx/conf.d/allow/${cfg.operators[operator].dir}.conf`
        let existingIps = []

        if(ips.length !== ips.unique().length)
            throw `You provided duplicate ips. Please check at ${Url}/${task}\n` + ips.duplicates().join(', ')

        await shell.chdir(RootDir)
        await shell.exec(`git clone git@gitlab.dopamine.bg:servers/servers-conf-${location}.git`,Econf)
        let currentConfig = fs.readFileSync(configFile).toString()

        for (let ip of ips){
                console.log("=============[ " + ip + " ]===============")
                if(currentConfig.grep(ip).length){
                    console.log('Address exists in current list.')
                    existingIps.push(ip)
                    continue
                }
                let mask = new Netmask(ip)
                let whoisData = (await whois(ip)).grep('^Country:|^City:|^Netname:|^Address:|^OrgName:')
                let reverseDns = 'Not found'
                try{ reverseDns = await dnsReverse(ip) } catch(e){}
                console.log([
                    whoisData,
                    '----------------',
                    `mask: [${mask.size}] ${mask.first} - ${mask.last}, reverse-dns: ${reverseDns}`,
                    '----------------',
                ].join("\n"))
        }
        console.log("Currently listed")
        console.log(currentConfig.grep('^allow'))
        await program.confirm(`Approved or not?`)
        await shell.chdir(RootDir + '/' + gitProject)
        await shell.exec(`git checkout -b ${branch}`,Econf)

        fs.appendFileSync(configFile,'\n# ' + now.padEnd(24,' ') + "#" + task + '\n')
        for (let ip of ips) {
            if(existingIps.indexOf(ip) === -1 ) fs.appendFileSync(configFile,'allow ' + (ip + ';').padEnd(20,' ') + '#' + task + '\n')
        }

        await shell.exec(`git add . && git commit -m "[${operator}] IP Whitelist (${task})"`,Econf)
        console.log(fs.readFileSync(configFile).toString().grep('^allow'))
        await shell.exec(`git push --set-upstream origin ${branch}`)

        if (program.params.reload){
            let answer = await program.ask(`Please confirm if "${branch}" has been merged into "master"?`, ['merged', ''], '')
            if (answer !== 'merged') throw new Error(`Aborting.. "${branch}" has to be merged into "master"`)
            let lb = await program.ssh(cfg.locations[location].hosts.lb, 'root')
            await lb.chdir('/opt/servers-conf')
            let changes = await lb.exec('git status --short --untracked-files=no')

            if (changes){
                await lb.exec('git fetch origin master --quiet')
                await lb.exec('git log HEAD..origin/master --oneline')
                await lb.exec('git diff HEAD..origin/master --name-status')
                throw Error('Aborting.. Manual changes found')
            }

            let rbranch = await lb.exec(`git rev-parse --abbrev-ref HEAD`, { silent: true })
            if (rbranch !== 'master') throw Error(`Aborting.. Manual changes found. The repo is not on master, but on branch ${rbranch}`)

            await lb.exec('git fetch origin master --prune --quiet')
            await lb.exec('git log HEAD..origin/master --oneline')
            await program.confirm('Are you sure you want to apply these changes?')

            await lb.exec('git reset --hard origin/master')

            await program.chat.message(`IPs from "${Url}/${task}" will be whitelisted.`)
            await program.chat.message('Reloading Nginx configuration..')

            console.log('\n# Reloading Nginx configuration..')
            await lb.exec(`nginx -s reload`)
            console.log('# Done.')

            await program.chat.message('Nginx configuration has been reloaded.')
        }

        console.log('\n# Run deployment tests by executing the following command:\n'
            + `node deploy/hermes/check -p 10 -o ${operator}\n`
        )

    })
// !TODO remove RootDir
