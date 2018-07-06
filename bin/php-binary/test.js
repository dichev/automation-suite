#!/usr/bin/env node
'use strict';

/**
 * Usage:
 * $ node bin/sys-metrics/check --host dev-hermes-web1
 */


const Deployer = require('deployer2')
const installed = require('./.installed.json')
const cfg = require('configurator')
let deployer = new Deployer(cfg.devops)

deployer

    .option('-h, --hosts <list|all>', 'The target host name', {choices: installed.hosts})
    .loop('hosts')

    .run(async (host) => {
    	//let h = cfg.hosts[host].alias
        //let location = cfg.hosts[host].location
        //let hostsList = cfg.locations[location].hosts

        let h = cfg.hosts[host]
        //let location = cfg.hosts[host].location
        let hostsList = cfg.locations[h.location].hosts


        //console.log(hostsList)
        //console.log(Object.keys(hostsList))
        //console.log(Object.values(hostsList))
        //console.log(Object.entries(hostsList))
        //console.log(Object.keys(hostsList).filter(function (key) {
        //  if(key.startsWith('web')) return true
        //    return false
        //}))

        console.log(
            Object.keys(hostsList)
                  .filter(key => key.startsWith('web'))
                  .filter(key => key !== h.alias)
                  //.map(key => key.toUpperCase() )
                  .join(",")
        )

    })

