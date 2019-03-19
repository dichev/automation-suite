#!/usr/bin/env node
'use strict';

const Program = require('dopamine-toolbox').Program
const SSHClient = require('dopamine-toolbox').SSHClient
const Shell = require('dopamine-toolbox').Shell
const GoogleChat = require('dopamine-toolbox').plugins.GoogleChat
const cfg = require('configurator')
const EXPECTED_REPLICAS = 2

let program = new Program({ chat: cfg.chat.rooms.deployBackend })



program
    .icon(GoogleChat.icons.DEPLOY)
    .description('Deploy cayetano docker swarm')
    .option('-l, --locations <list|all>', 'The target host name', {choices: Object.keys(cfg.locations), required: true})
    .option('-r, --rev <string>', 'Desired git revision/tag (useful for rollback)', { def: 'origin/master' })

    .iterate('locations', async (location) => {
        const REVISION = program.params.rev
        let web1 = await new SSHClient().connect({ host: cfg.locations[location].hosts.web1, username: 'root' })
        
        
        await web1.chdir('/opt/dopamine/docker-conf')
        await web1.exec(`git fetch --prune && git reset --hard ${REVISION}`)
        
        
        let image = (await web1.exec('cat cayetano-stack.yml  | grep image | grep cayetano-math')).trim().replace('image:', '').trim()
        if(!image) throw Error('Wrong configuration, there is no image for the cayetan-math')
        console.log(`Pulling ${image} on all webs to speed up the deploy populating`)
        for(let web of cfg.locations[location].hosts.webs){
            let ssh = await new SSHClient().connect({host: web.ip, username: 'root'})
            await ssh.exec(`docker pull ${image}`)
            await ssh.disconnect()
        }
        
        
        await program.confirm('Deploy the new version?')
        await program.chat.message(`Deploying ${image}..`)
        await web1.exec('docker stack deploy --with-registry-auth -c cayetano-stack.yml cayetano')
    
    
        // TODO: look for a better solution to wait deployment to finish (may be docker events)
        await program.chat.message(`\nWaiting deployment of ${EXPECTED_REPLICAS} replicas`)
        while (true){
            let count  = parseInt(await web1.exec(`docker stack ps cayetano --format "{{.Node}} ({{.Image}}): {{.CurrentState}} {{.Error}}" --filter 'name=cayetano_math' | grep -i 'running' | grep ${image} | wc -l`, {silent: true}))
            let status = await web1.exec(`docker stack ps cayetano --format "{{.Node}} ({{.Image}}): {{.CurrentState}} {{.Error}}" --filter 'name=cayetano_math' | grep -vi 'shutdown'`)
            if(count === EXPECTED_REPLICAS){
                console.log(`Success! Found ${count}/${EXPECTED_REPLICAS} running replicas`)
                break
            }
            await program.sleep(1, `Found ${count}/${EXPECTED_REPLICAS}, waiting`)
        }
        
        
        let shell = new Shell()
        await shell.exec(`node deploy/cayetano/check -l ${location}`)
        
        console.log('\nNote it\'s expected delay during containers update.')
        console.log('Check the versions using:')
        console.log(`  node servers/executor/exec -h ${location}-web1 -e "docker stack ps cayetano --filter 'name=cayetano_math'"`)
        console.log(`  node deploy/cayetano/check -l ${location}`)
        
        await web1.disconnect()
    })

