#!/usr/bin/env node
'use strict'

// source https://dev.mysql.com/doc/refman/5.7/en/replication-mode-change-online-enable-gtids.html
// usage ./gtid-migrations-simplified.js --databases [belgium1,dev,etc] --group [master,archive]

const   Program = require('dopamine-toolbox').Program,
        SSHClient = require('dopamine-toolbox').SSHClient,
        MySQL = require('dopamine-toolbox').MySQL,
        cfg = require('configurator'),
        DB_CNF = {
            user: 'root',//cfg.access.mysql.readOnly.user,
            password: '',//cfg.access.mysql.readOnly.password,
            database:''
        },
        CMD_GTID_OFF = `cd /etc/mysql && git reset --hard GTID_OFF_2 && git status`,
        CMD_GTID_ON  = `cd /etc/mysql && git reset --hard GTID_ON_2 && git status`;
let     sshConnections = {},
        dbConnections = {},
        program = new Program({chat: cfg.chat.rooms.devops});

let run = async (what,where,payload,cb = () => {}) => { // replace ['SELECT NOW() as tm, "OFF" as Value' ... ] with [p] for production purposes ---\/
    await program.sleep(2,payload.join(', ') + ' -> ' + where.join(', '))
    await program.confirm("Confirm to continue:")
    await program.chat.message('`' + payload.join('\n') + '`')
    if(what === 'query') for(let ip of where) for (let p of payload) cb(ip,await dbConnections[ip].query(p))
    if(what === 'exec')  for(let ip of where) for (let p of payload) cb(ip,await sshConnections[ip].exec(p)) // <-- replace ['whoami'] with [p] for production purposes
}
let checkMode = (ip,res) => {
    for(let line of res){
        if(line.Value === 'ON') throw(ip + ' ' + line.Variable_name + ' is set to: ' + line.Value)
    }
}

program
    .description("Migrate to GTID")
    .option('-d, --databases <name>', 'Target database from Configurator.databases', { required: true, choices: Object.keys(cfg.databases) })
    .option('-g, --group <name>',' Target cluster group [master,archive]',{ required:true, choices: ['master','archive']})
    .iterate('databases', async (db) => {

        let hostsAll = [cfg.databases[db].master,cfg.databases[db].backups.master,cfg.databases[db].slave],
            hostsSlave = [cfg.databases[db].backups.master,cfg.databases[db].slave];
        if(program.params.group === 'archive'){
            hostsAll = [cfg.databases[db].archive,cfg.databases[db].backups.archive]
            hostsSlave = [cfg.databases[db].backups.archive]
        }
        await program.confirm("Processing:[" + hostsAll.join(', ') + "] with slaves: [" + hostsSlave.join(', ') + '] ?')
        for(let host of hostsAll){
            sshConnections[host] = await new SSHClient().connect({host: host,username: 'root',agent:process.env.SSH_AUTH_SOCK})
            dbConnections[host] = await new MySQL().connect(DB_CNF, sshConnections[host])
        }

        await run('query',hostsAll,["SHOW VARIABLES LIKE '%gtid_mod%'"],checkMode)

        await program.confirm("Look above. Do you want to continue!")
        await run('exec',hostsAll,[CMD_GTID_OFF])

        await program.confirm("Ini files modified. Please check. Pres enter when ready!")

        await run('query',hostsAll,["SET @@GLOBAL.ENFORCE_GTID_CONSISTENCY = WARN"])

        await program.confirm("Leave running for a while and check logs for any warnings. Continue (if no warnings) !")
        await run('query',hostsAll,["SET @@GLOBAL.ENFORCE_GTID_CONSISTENCY = ON"])
        await run('query',hostsAll,["SET @@GLOBAL.GTID_MODE = OFF_PERMISSIVE"])
        await run('query',hostsAll,["SET @@GLOBAL.GTID_MODE = ON_PERMISSIVE"])

        await run('query',hostsAll,["SHOW STATUS LIKE 'ONGOING_ANONYMOUS_TRANSACTION_COUNT'"],console.log)
        await program.confirm("On each server, wait until the status variable ONGOING_ANONYMOUS_TRANSACTION_COUNT is zero. \nQUERY: SHOW STATUS LIKE 'ONGOING_ANONYMOUS_TRANSACTION_COUNT'")
        await run('query',hostsAll,["SET @@GLOBAL.GTID_MODE = ON"])
        await run('exec',hostsAll,[CMD_GTID_ON])

        await program.confirm("Ini files modified. Please check. Pres enter when ready!")
/*
        await run('query',hostsSlave,[
            "STOP SLAVE [FOR CHANNEL 'channel']",
            "CHANGE MASTER TO MASTER_AUTO_POSITION = 1 [FOR CHANNEL 'channel']",
            "START SLAVE [FOR CHANNEL 'channel']"
        ])
*/
        await run('query',hostsSlave,[
            "STOP SLAVE",
            "CHANGE MASTER TO MASTER_AUTO_POSITION = 1",
            "START SLAVE"
        ])

        await run('query',hostsAll,["SHOW VARIABLES LIKE '%relay_log_basename%'"],console.log)
/**/
        for(let ip in dbConnections) await dbConnections[ip].disconnect()
        for(let ip in sshConnections) await sshConnections[ip].disconnect()
        console.log('done');
});

/*
watch "cd /etc/mysql && git status"
watch "mysql -e \"SHOW VARIABLES LIKE '%gtid%'\" | column -t"
tail -f /var/log/mysql/error.log
 */
