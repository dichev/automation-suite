#!/usr/bin/env node
'use strict';

const Program = require('dopamine-toolbox').Program
const SSHClient = require('dopamine-toolbox').SSHClient
const cfg = require('configurator')
const DEST = `d:/www/servers/servers-conf-mysql/current`

const SQL = `
SHOW VARIABLES WHERE variable_name IN(
    'bind_address',
    'expire_logs_days',
    'gtid_mode',
    'innodb_buffer_pool_instances',
    'innodb_buffer_pool_size',
    'log_bin',
    'log_slave_updates',
    'server_id',
    'slave_parallel_type',
    'slave_parallel_workers',
    'table_definition_cache',
    'table_open_cache'
)`
const DB_HOSTS = Object.keys(cfg.hosts).filter(h => h.includes('sql') || h.includes('-db-'))

let program = new Program()
program
    .description('Generate server-conf for specific location')
    .option('-h, --hosts <list|all>', 'The target host name', {choices: DB_HOSTS, required: true})
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

