#!/usr/bin/env node
'use strict';

/**
 * Usage:
 * $ node bin/php-binary/check --hosts dev-hermes-web1
 */


const Program = require('dopamine-toolbox').Program
const installed = require('./.installed.json')
const cfg = require('configurator')
let program = new Program(cfg.devops)

const assert = require('assert')

program

    .option('-h, --hosts <list|all>', 'The target host name', {choices: installed.hosts, required: true})
    .loop('hosts')

    .run(async (host) => {
        let ssh = await program.ssh(cfg.getHost(host).ip, 'root')
        ssh.silent = true
    
        let tester = program.tester(host)
        let it = tester.it
        
        it('should be Debian 9', async () => {
            assert.strictEqual(await ssh.exec(`cat /etc/issue`), 'Debian GNU/Linux 9 \\n \\l')
        })
        it('should have active systemd process', async () => {
            assert.ok((await ssh.exec(`systemctl status php-fpm | grep Active`)).startsWith('Active: active (running) '), 'php-fpm process systemd is not active!')
        })
        it('should loaded exactly php-7.1.20', async () => {
            assert.strictEqual(await ssh.exec(`php --ini | grep Loaded`), 'Loaded Configuration File:         /opt/phpbrew/php/php-7.1.20/etc/php.ini')
        })
        it('should be phpv7.1.20 with OPcache enabled', async () => {
            assert.strictEqual(await ssh.exec(`php -v | grep OPcache`), 'with Zend OPcache v7.1.20, Copyright (c) 1999-2018, by Zend Technologies')
        })
        it('should use custom php settings', async () => {
            assert.strictEqual(await ssh.exec(`php -r "echo ini_get('max_input_vars') . PHP_EOL;"`), '20000')
            assert.strictEqual(await ssh.exec(`php -r "echo ini_get('log_errors') . PHP_EOL;"`), '1')
            assert.strictEqual(await ssh.exec(`php -r "echo ini_get('disable_functions') . PHP_EOL;"`), 'exec,passthru,shell_exec,system,proc_open,popen,parse_ini_file,show_source,phpinfo,pcntl_exec,pcntl_fork,pcntl_alarm,pcntl_signal,pcntl_wait,pcntl_waitpid,pcntl_setpriority')
            assert.strictEqual(await ssh.exec(`php -r "echo ini_get('error_log') . PHP_EOL;"`), '/var/log/php/error.log')
        })
        it('should have all required modules', async () => {
            assert.strictEqual(await ssh.exec(`php -r "echo implode(',',get_loaded_extensions()).PHP_EOL;"`), 'Core,date,libxml,pcre,zlib,bcmath,ctype,curl,dom,filter,hash,json,mbstring,SPL,PDO,session,standard,readline,Reflection,Phar,SimpleXML,soap,mysqlnd,mysqli,tokenizer,xml,xmlreader,xmlwriter,xsl,zip,pdo_mysql,Zend OPcache')
        })

        await tester.run()
        
        console.log(`Everything is okay ;)`)
        await program.chat.notify(`All tests passed! Everything is okay ;)`, {color: 'green'})
    })

