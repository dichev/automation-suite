#!/usr/bin/env node
'use strict';

const Program = require('dopamine-toolbox').Program
const cfg = require('configurator')

let program = new Program({ chat: cfg.chat.rooms.devops })

program
.description('Update Prod. Monitoring docker service')
.example(`
        node deploy/prodmon/update
    `)
.run(async () => {
    await program.confirm(`Warning! You're going to update to the last revision.\nDo you want to continue?`)

    let sshRoot = await program.ssh(cfg.hosts['sofia-devops-monitoring'].ip, 'root')
    let chat  = program.chat

    console.log('Updating stack...')
    await sshRoot.chdir('/docker/docker-stacks/prodmon')
    await sshRoot.exec('docker stack deploy --compose-file prodmon-stack.yml --prune --with-registry-auth prodmon')

    console.log('Getting services...')
    await sshRoot.exec('docker service ls')

    console.log('Getting containers...')
    await sshRoot.exec('docker ps --format "table {{.ID}} {{.Names}}"')

    await chat.notify('Finished')
})