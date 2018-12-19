#!/usr/bin/env node
'use strict';

const Program = require('dopamine-toolbox').Program
const SSHClient = require('dopamine-toolbox').SSHClient
const Input = require('dopamine-toolbox').Input
const cfg = require('configurator')
let program = new Program()


program
    .description('Safely add ssh public key to multiple hosts')
    .option('-h, --hosts <list|all>', 'The target host names', { choices: Object.keys(cfg.hosts), required: true })
    .option('-u, --user <dopamine|root>', 'The key will be added for this user', { choices: ['dopamine', 'root'], required: true })
    .parse()
    

Promise.resolve().then(async() => {
    console.log(`\nAdd key to following hosts: \n ${program.params.hosts.split(',').join('\n ')}\n`)
    
    let input = new Input({collectHistoryFile: __dirname + '/.history'})
    const KEY = (await input.ask('Paste ssh-rsa key')).trim()
    if(!KEY) throw Error('Invalid key')
    
    await input.confirm('\nContinue?')
    
    await program.iterate('hosts', async (host) => {
        const DIR = program.params.user === 'root' ? '/root/.ssh' : `/home/${program.params.user}/.ssh`
        let ssh = await new SSHClient().connect({host: cfg.getHost(host).ip, username: 'root' })
        
        
        // Check if key exists
        let keyExists = await ssh.exec(`grep '${KEY}' ${DIR}/authorized_keys || echo`, { silent: true })
        if(keyExists.trim()) {
            console.warn(`The key already exists for user ${program.params.user}, skipping..`)
            await ssh.disconnect()
            return
        }

        
        
        // Backup & add the new key
        console.log('Backup current keys..')
        await ssh.exec(`cp -v ${DIR}/authorized_keys ${DIR}/authorized_keys-PREVIOUS`)
    
        console.log(`Adding key to ${DIR}/authorized_keys`)
        await ssh.exec(`echo '${KEY}' >> ${DIR}/authorized_keys`)
        console.log('done!')
        
        
        
        // VERY IMPORTANT!
        // The code bellow will test is the root access lost accidentally and will try to recover it
        // it's purposely written very paranoid
        console.log('\nTest root access')
        try {
            let ssh2 = await new SSHClient().connect({host: cfg.getHost(host).ip, username: 'root'})
            await ssh2.exec('echo success')
            await ssh2.disconnect()
        }
        catch (err) {
            console.error(err.toString())
            console.warn('Something is wrong, restoring previous keys')
            try {
                await ssh.exec(`mv ${DIR}/authorized_keys ${DIR}/authorized_keys-FAILED; mv ${DIR}/authorized_keys-PREVIOUS ${DIR}/authorized_keys`)
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

