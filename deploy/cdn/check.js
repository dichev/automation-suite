#!/usr/bin/env node
'use strict'

/**
 * Usage:
 * $ node deploy/cdn/check --hosts dev-hermes-lb --mode blue --revision r4.8.233
 */

const Program = require('dopamine-toolbox').Program
const SSHClient = require('dopamine-toolbox').SSHClient
const cfg = require('configurator')
const compare = require('node-version-compare')
const assert = require('assert')
const empty = (str) => { if(str !== '') throw Error(str) }
const HOSTS = Object.values(cfg.hosts).filter(h => h.type === 'cdn').map(h => h.name)

let program = new Program()

program
    .description('Test suit of games cdn')
    .option('-h, --hosts <list|all>', `Comma-separated list of cdn regions`, {choices: HOSTS, required: true})
    .option('-r, --revision <string>', `Target revision (like r3.9.9.0)`)
    .option('-m, --mode <blue|green>', `Which cdn to be updated`, {choices: ['blue', 'green'], required: true })

    .iterate('hosts', async (host) => {
        const REV = program.params.revision
        const MODE = program.params.mode
        const DEST = `/home/dopamine/cdn/repos/${MODE}`
    
        let cdn = new SSHClient()
        await cdn.connect({host: cfg.getHost(host).ip, username: 'dopamine'})
        cdn.silent = true
        
        let tester = program.tester(host)
        let it = tester.it
        
        it(`should exists`, async() => await cdn.chdir(DEST))
        it(`should be able to fetch from the repository`, async() => await cdn.exec(`git fetch origin --tags`))
    
        it('should be at #master branch', async () => {
            assert.strictEqual(await cdn.exec(`git rev-parse --abbrev-ref HEAD`), 'master')
        })
        it('should not have local changes', async () => {
            empty(await cdn.exec(`git status --short --untracked-files=no`))
        })
        it.warn('may not have untracked files', async () => {
            empty(await cdn.exec(`git ls-files --others --exclude-standard`))
        })
    
        it(`target release exist`, async () => {
            if (!REV) return it.skip()
            assert.strictEqual(await cdn.exec(`git tag --list ${REV}`), REV)
        })
    
        it(`target release is not behind than current release`, async () => {
            if (!REV) return it.skip()
            let current = await cdn.exec(`git describe --tags`)
            let compared = compare(current, REV)
            if (compared === 1) throw Error(`The current release is NOT BEHIND the target release: ${current} => ${REV}`)
            
        })
        
        it.warn(`target release is not the same as current release`, async() => {
            if (!REV) return it.skip()
            let current = await cdn.exec(`git describe --tags`)
            let compared = compare(current, REV)
            if (compared === 0) throw Error(`The current release is THE SAME as the target release: ${current} => ${REV}`)
        })
    
        it.info(`diffs between releases:`, async () => {
            if (!REV) return it.skip()
            console.info('      ' + await cdn.exec(`git diff --shortstat ${REV}`))
        })
    
        await tester.run(false)
        await cdn.disconnect()
    })
    .then(() => { // after all iterations
        program.tester().status(true) // will throw error if any test failed
    })


