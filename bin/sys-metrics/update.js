#!/usr/bin/env node
'use strict';

/**
 * Usage:
 * $ node bin/sys-metrics/update --host dev-hermes-web1 --revision v3.2.5
 */


let Deployer = require('deployer2')
let deployer = new Deployer()

deployer
    .option('-h, --host <name>', 'The target host name (all hosts are predefined in deployer configuration)')
    .option('-r, --revision <tag>', 'The target version as tag name')
    
    .run(async () => {
    
        let ssh = await deployer.ssh(deployer.params.host, 'root')
        
        console.info('\n1. Fetch from the remote:')
        
        await ssh.chdir('/opt/dopamine/sys-metrics')
        await ssh.exec('git fetch --prune origin')
        
        console.info('\n2. Deploy')
        await ssh.exec('git reset --hard ' + deployer.params.revision)
        await ssh.exec('systemctl restart sys-metrics')
        await ssh.exec('systemctl status sys-metrics | head -n 3')
        
        console.info('The version is updated to latest revision')
        
    })

