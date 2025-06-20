#!/usr/bin/env node
'use strict';

const Program = require('dopamine-toolbox').Program
const cfg = require('configurator')
const compare = require('node-version-compare');
const assert = require('assert')
const empty = (str) => { if(str !== '') throw Error(str) }


let program = new Program({chat: cfg.chat.rooms.deployBackend})

program
    .description('Pre-deployment tests')
    .option('-o, --operators <list|all>', `Comma-separated list of operators`, {choices: Object.keys(cfg.operators), required: true})
    .option('-r, --rev <string>', `Target revision (like r3.9.9.01) or from..to revision (like r3.9.9.0..r3.9.9.1)`)
    .example(`
         node deploy/hermes/check --operators all -p 10
         node deploy/hermes/check -o bots,rtg
         node deploy/hermes/check -o bots -r r3.9.9.1
         node deploy/hermes/check -o bots -r r3.9.9.0..r3.9.9.1
    `)
    
    .iterate('operators', async (operator) => {
        const location = cfg.getLocationByOperator(operator);
        const DEST = 'production/' + cfg.operators[operator].dir
        const REVS = program.params.rev
        const [from, to] = REVS && REVS.includes('..') ? REVS.split('..') : [null, REVS]
        
        let web1 = await program.ssh(location.hosts.web1, 'dopamine')
        web1.silent = true
        
        let tester = program.tester(operator)
        let it = tester.it
        
        it(`should exists in web1`, async() => await web1.chdir(DEST))
        it(`should be able to fetch from the repository`, async() => await web1.exec(`git fetch origin --tags`))
    
        it('should be at #master branch', async () => {
            assert.strictEqual(await web1.exec(`git rev-parse --abbrev-ref HEAD`), 'master')
        })
        it('should not have local changes', async () => {
            empty(await web1.exec(`git status --short --untracked-files=no`))
        })
        it.warn('may not have untracked files', async () => {
            empty(await web1.exec(`git ls-files --others --exclude-standard`))
        })
    
        it(`current release is the same as expected`, async () => { // TODO: better display as skipped
            if (!from) return it.skip()
            assert.strictEqual(await web1.exec(`git describe --tags`), from)
        })
    
        it(`target release exist`, async () => {
            if (!to) return it.skip()
            assert.strictEqual(await web1.exec(`git tag --list ${to}`), to)
        })
    
        it(`target release is greater than current release`, async () => {
            if (!to) return it.skip()

            let current = await web1.exec(`git describe --tags`);
            let compared = compare(current, to);
            if (compared === 1)  throw Error(`The current release is NOT BEHIND the target release: ${current} => ${to}`);
            if (compared === 0)  throw Error(`The current release is THE SAME as the target release: ${current} => ${to}`);
        })
    
        it.info(`diffs between releases:`, async () => {
            if (!to) return it.skip()
            console.info('      ' + await web1.exec(`git diff --shortstat ${to}`))
        })
    
        await tester.run(false)
    })
    .then(() => { // after all iterations
        program.tester().status(true) // will throw error if any test failed
    })


