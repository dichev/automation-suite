#!/usr/bin/env node
'use strict';

const Program = require('dopamine-toolbox').Program
const cfg = require('configurator')
const empty = (str) => { if(str !== '') throw Error(str) }
const assert = require('assert')
const contains = (str, search) => { if(!str.includes(search)) throw Error(str) }
let program = new Program({chat: cfg.chat.rooms.devops})

program
    .description('Pre-deployment tests for Grafana-Sensors')
    .example(`
         node deploy/monitoring/check
    `)
    .run(async () => {
        const DEST = '/home/dopamine/grafana-sensors/'
        
        let web1 = await program.ssh(cfg.hosts['sofia-devops-monitoring'].ip, 'dopamine')
        web1.silent = true
        
        let tester = program.tester()
        let it = tester.it
        
        it(`should exists in web1`, async() => await web1.chdir(DEST))
        it(`should be able to fetch from the repository`, async() => await web1.exec(`git fetch origin --tags`))
        
        it('should be at #master branch', async () => {
            assert.strictEqual(await web1.exec(`git rev-parse --abbrev-ref HEAD`), 'master')
        })
        it('should not have local changes', async () => {
            empty(await web1.exec(`git status --short --untracked-files=no`))
        })
        it('should be with Status of the service -> Active: active(running)', async () => {
            contains(await web1.exec(`systemctl status grafana-sensors.service | grep "Active: active (running)"`), "Active: active (running)")
        })
        it('should be able to call a single sensor and return success', async () => {
            contains(await web1.exec(`node test.js sensors/availability-heartbeat.js rtg`), "heartbeat.panel.status")
        })
        
        it.info(`diffs between releases:`, async () => {
            console.info('      ' + await web1.exec(`git diff`))
        })
        
        await tester.run(false)
    })
    .then(() => { // after all iterations
        program.tester().status(true) // will throw error if any test failed
    })