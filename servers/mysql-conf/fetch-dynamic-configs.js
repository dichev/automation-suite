#!/usr/bin/env node
'use strict';

const Program = require('dopamine-toolbox').Program
const SSHClient = require('dopamine-toolbox').SSHClient
const cfg = require('configurator')
const DEST = `d:/www/servers/servers-conf-mysql/current`

const SQL = `
SHOW VARIABLES WHERE variable_name IN(
    'server_id',
    'expire_logs_days',
    'innodb_buffer_pool_size',
    'innodb_buffer_pool_instances',
    'log_bin',
    'bind_address',
    'slave_parallel_type',
    'slave_parallel_workers',
    'gtid_mode',
    'table_definition_cache',
    'table_open_cache',
    'log_slave_updates'
)`

let program = new Program()
program
    .description('Generate server-conf for specific location')
    .option('-h, --hosts <list|all>', 'The target host name', {choices: Object.keys(cfg.hosts).filter(h => h.includes('sql')), required: true})
    .option('-d, --dest <path>', 'Output generated data to destination path')
    .parse()


program
    .iterate('hosts', async (host) => {
        const dest = (program.params.dest || DEST).replace(/\\/g, '/')
        
        let ssh = await new SSHClient().connect({host: cfg.getHost(host).ip, username: 'root'})
        
        let settings = await ssh.exec(`mysql -uroot -e "${SQL}" | awk '{ if(NR>1) print $1 ":" $2}'`, {silent: true})
        let json = {}
        settings.split('\n').map(s => s.split(':') ).forEach(([key, val]) => {
            if(key === 'innodb_buffer_pool_size') {
                if(val % 1024**3 === 0) val = val/1024/1024/1024 + 'G'
                if(val % 1024**2 === 0) val = val/1024/1024 + 'M'
            }
            json[key] = val
        })
        console.log(json)

        await ssh.disconnect()
})

