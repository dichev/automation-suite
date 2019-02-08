#!/usr/bin/env node
'use strict';

(async () => {

    const Program = require('dopamine-toolbox').Program
    const cfg = require('configurator')
    const SSHClient = require('dopamine-toolbox').SSHClient

    let program = new Program({chat: ''})
    let rows = function(key,val){
        return key.padEnd(20,' ')+ ': ' + val + "\n"
    }

    let getSpinsPerSec = async function(ip,hook){
        let measureTime = 1
        let cmd = `timeout ${measureTime} tail -f -n 0 /var/log/nginx/access.log | grep ${hook} --line-buffered | grep 'game/spin' || echo ''`
        let ssh = await new SSHClient().connect({host: ip, username: 'root'})
        let sps = await ssh.exec(cmd,{silent:true})
        sps = ( sps === '' ? 0 : (sps.split("\n").length / measureTime) )
        await ssh.disconnect()
        return sps
    }

    program
        .description('Show information about operator')
        .option('-o, --operators <list|all>', `Comma-separated list of operators`, {choices: Object.keys(cfg.operators), required: true})
        .iterate('operators', async (operator) => {
            let output = ""
            operator = cfg.operators[operator]
            output += rows('# --> ' + operator.name,''.padEnd(30,'='))
            operator.baseDir = operator.baseDir + '/' + operator.dir
            delete(operator.dbPrefix)
            delete(operator.cdn)
            delete(operator.fpm)
            delete(operator.dir)
            delete(operator.analytics)
            delete(operator.sharedJackpot)
            let hosts = cfg.locations[operator.location].hosts
            for(let key in operator){

                if(key !== 'name') output += rows(key,operator[key])

                if(key === 'location' ){
                    output += rows('lb',hosts.lb)
                    output += rows('web1',hosts.web1)
                }
            }
            output += rows('spins per sec.',await getSpinsPerSec(hosts.lb,'gserver-' + operator.name + '.' + operator.domain))
            console.log(output)
        })
})();