#!/usr/bin/env node
'use strict'

const   Program = require('dopamine-toolbox').Program,
        SSHClient = require('dopamine-toolbox').SSHClient,
        MySQL = require('dopamine-toolbox').MySQL,
        colors = require('chalk'),
        cfg = require('configurator');

let     sshConnections = {},
        dbConnections = {},
        allowedLocations = [],
        program = new Program();

// parse config to get list of allowed/available locations

for(let host in cfg.hosts){
    let l = cfg.hosts[host].location
    if(allowedLocations.indexOf(l) === -1 && l !== '') allowedLocations.push(l)
}

let run = async (what,where,payload,cb = () => {}) => {
    await program.sleep(2,payload.join(', ') + ' -> ' + Object.keys(where).join(', '))
    if(what === 'query') for(let hostName in where) for (let p of payload) cb([hostName,await dbConnections[hostName].query(p)])
    if(what === 'exec')  for(let hostName in where) for (let p of payload) cb([hostName,await sshConnections[hostName].exec(p,{silent:true})])
}

let connectSSH = async (hosts) => {
    for(let hostName in hosts){
        try{
            sshConnections[hostName] = await new SSHClient().connect({host: hosts[hostName].ip,username: 'root'})
        }catch(e){ console.log(['SSH',hostName,e.message]) }
    }
}

let connectDba = async (hosts) => {
    for(let hostName in hosts){
        try{
            if(typeof sshConnections[hostName] !== 'undefined'){ //  connect only hosts with active ssh tunel
                dbConnections[hostName] = await new MySQL().connect({user:'root'}, sshConnections[hostName])
            }
        }catch(e){ console.log(['MySQL',hostName,e.message]) }
    }
}

program
    .description("Migrated Operator settings")
    .option('-l, --locations <name>', 'targetLocation', { required: true, choices: allowedLocations })
    .iterate('locations', async (location) => {
        let hosts = {}
        let hostsDbArchive = {}
        let hostsSSh = {}
        let hostsDbMaster = {}
        let hostsWeb = {}
        let hostsLb = {}

        for (let hostName in cfg.hosts){
            let host = cfg.hosts[hostName]
            let type = host.type
            if (host.location === location){
                hosts[hostName] = host
                if(['mysql-master','mysql-slave'].indexOf(type) > -1) hostsDbMaster[hostName] = host
                if(['mysql-archive'].indexOf(type) > -1) hostsDbArchive[hostName] = host
                if(['web'].indexOf(type) > -1) hostsWeb[hostName] = host
                if(['lb'].indexOf(type) > -1) hostsLb[hostName] = host
            }
        }

        await program.confirm("List of hosts is as fallows:\n"
            +"HostsLb: " + colors.green(Object.keys(hostsLb).join(', ')) + "\n"
            +"HostsWeb: " + colors.green(Object.keys(hostsWeb).join(', ')) + "\n"
            +"HostsDbMaster: " + colors.green(Object.keys(hostsDbMaster).join(', ')) + "\n"
            +"HostsDbArchive: " + colors.green(Object.keys(hostsDbArchive).join(', ')) + "\n"
            +"\n"
            +"If list is correct press ENTER to continue.\nIf list is NOT correct type [no] to exit.")

        await connectSSH(hosts)
        await connectDba(hostsDbMaster)
        await connectDba(hostsDbArchive)
        for(let hostName in sshConnections) hostsSSh[hostName] = hosts[hostName]

/*
...
    Code goes here. List of useful variables!!!

    hosts => All hosts for that location.
    hostsDbMaster => All Databases from Master Block for this location.
    hostsDbArchive => All Databases from Archive Block for this location.
    hostsWeb => All Web ( php ) hosts for that location.
    hostsLb => All lb's for that location.
    hostsSSH => All hosts connected over ssh.

... EXAMPLES Below ---\/
*/

        await run('query',hostsDbMaster,["SELECT NOW() as tm"],console.log)
        await run('query',hostsDbArchive,["SELECT NOW() as tm"],console.log)
        await run('exec',hostsWeb,[
            "whoami",
            "su dopamine -c \"cd /home/dopamine && find /home/dopamine -name server.config.php -exec grep \\\"host\\\" '{}' \\; | wc -l \"",
            "date +%Y-%M-%d\\ %H:%m:%S"
        ],console.log)

/*
... EXAMPLES Above ---/\

*/

        for(let ip in dbConnections) await dbConnections[ip].disconnect()
        for(let ip in sshConnections) await sshConnections[ip].disconnect()
        console.log('done');
    });
