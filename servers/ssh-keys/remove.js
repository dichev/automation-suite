#!/usr/bin/env node
'use strict';

const Program = require('dopamine-toolbox').Program
const SSHClient = require('dopamine-toolbox').SSHClient
const Input = require('dopamine-toolbox').Input
const cfg = require('configurator')
let program = new Program()


program
    .description('Safely REMOVE ssh public key to multiple hosts')
    .option('-h, --hosts <list|all>', 'The target host names', { choices: Object.keys(cfg.hosts), required: true })
    .option('-u, --user <dopamine|root>', 'The key will be removed for this user', { choices: ['dopamine', 'root'], required: true })
    .parse()
    

Promise.resolve().then(async() => {
    console.log(`\nREMOVE key to following hosts: \n ${program.params.hosts.split(',').join('\n ')}\n`)
    
    let input = new Input({collectHistoryFile: __dirname + '/.history'})
    const KEY = (await input.ask('Paste part of ssh-rsa key or comment to be removed')).trim()
    if(!KEY) throw Error('Invalid key')
    
    console.warn(`\nWARNING! This will remove access to all keys that match to: ${KEY}`)
    await input.confirm('Continue?')
    
    await program.iterate('hosts', async (host) => {
        const DIR = program.params.user === 'root' ? '/root/.ssh' : `/home/${program.params.user}/.ssh`
        let ssh = await new SSHClient().connect({host: cfg.getHost(host).ip, username: 'root' })
        
        
        // Check if key don't exists
        let keyExists = await ssh.exec(`grep '${KEY}' ${DIR}/authorized_keys || echo`, { silent: true })
        if(!keyExists.trim()) {
            console.warn(`The key doesn't exist for user ${program.params.user}, skipping..`)
            await ssh.disconnect()
            return
        }

        
        
        // Backup & checks
        console.log('Backup current keys..')
        let backupFile = `${DIR}/authorized_keys-BACKUP-${Date.now()}`
        await ssh.exec(`cp -pv ${DIR}/authorized_keys ${backupFile}`)

        let left = await ssh.exec(`grep -v '${KEY}' ${DIR}/authorized_keys`, { silent: true })
        if(!left.trim().length) throw Error('Aborting! There will be no keys left after this operation..')
        
        
        // VERY IMPORTANT!
        // The code bellow will test is the root access lost accidentally and will try to recover it
        // it's purposely written very paranoid
        console.log('\nTesting root access..')
        try {
            // WARNING! The actual key removal
            console.log(`Removing ${KEY} from ${DIR}/authorized_keys`)
            await ssh.exec(`grep -v '${KEY}' ${DIR}/authorized_keys > ${DIR}/authorized_keys-NEXT`)
            await ssh.exec(`rm ${DIR}/authorized_keys && mv ${DIR}/authorized_keys-NEXT ${DIR}/authorized_keys`)
            
            let ssh2 = await new SSHClient().connect({host: cfg.getHost(host).ip, username: 'root'})
            await ssh2.exec('echo success')
            await ssh2.disconnect()
        }
        catch (err) {
            console.error(err.toString())
            console.warn('Something is wrong, restoring previous keys')
            try {
                await ssh.exec(`mv ${DIR}/authorized_keys ${DIR}/authorized_keys-FAILED; mv ${backupFile} ${DIR}/authorized_keys`)
                console.log('Restored!')
            } catch (err){
                console.error(err)
                // do not close the connection on error
            }
            console.log('Keeping ssh connection open, please test do you have access to the host')
            let input2 = new Input()
            while (true){
                let cmd = await input2.ask('Execute command')
                if(cmd === 'exit') break
                try {
                    await ssh.exec(cmd)
                } catch (e) {
                    console.log(e)
                }
            }
        }
        
        await ssh.disconnect()
    })
})

