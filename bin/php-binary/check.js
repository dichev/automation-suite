#!/usr/bin/env node
'use strict';

/**
 * Usage:
 * $ node bin/php-binary/check --hosts dev-hermes-web1
 */


const Deployer = require('deployer2')
const installed = require('./.installed.json')
const cfg = require('configurator')
let deployer = new Deployer(cfg.devops)

const assert = require('assert')

deployer

    .option('-h, --hosts <list|all>', 'The target host name', {choices: installed.hosts})
    .loop('hosts')

    .run(async (host) => {
        let ssh = await deployer.ssh(cfg.getHost(host).ip, 'root')
    
        assert.equal(await ssh.exec(`cat /etc/issue`), 'Debian GNU/Linux 9 \\n \\l')
        assert.ok((await ssh.exec(`systemctl status php-fpm | grep Active`)).startsWith('Active: active (running) '), 'php-fpm process systemd is not active!')
        assert.equal(await ssh.exec(`php --ini | grep Loaded`), 'Loaded Configuration File:         /opt/phpbrew/php/php-7.1.19/etc/php.ini')
        assert.equal(await ssh.exec(`php -v | grep OPcache`), 'with Zend OPcache v7.1.19, Copyright (c) 1999-2018, by Zend Technologies')
        assert.equal(await ssh.exec(`php -r "echo ini_get('max_input_vars') . PHP_EOL;"`), '20000')
        assert.equal(await ssh.exec(`php -r "echo ini_get('log_errors') . PHP_EOL;"`), '1')
        assert.equal(await ssh.exec(`php -r "echo ini_get('disable_functions') . PHP_EOL;"`), 'exec,passthru,shell_exec,system,proc_open,popen,parse_ini_file,show_source,phpinfo,pcntl_exec,pcntl_fork,pcntl_alarm,pcntl_signal,pcntl_wait,pcntl_waitpid,pcntl_setpriority')
        assert.equal(await ssh.exec(`php -r "echo ini_get('error_log') . PHP_EOL;"`), '/var/log/php/error.log')
        assert.equal(await ssh.exec(`php -r "echo implode(',',get_loaded_extensions()).PHP_EOL;"`), 'Core,date,libxml,pcre,zlib,bcmath,ctype,curl,dom,filter,hash,json,mbstring,SPL,PDO,session,standard,readline,Reflection,Phar,SimpleXML,soap,mysqlnd,mysqli,tokenizer,xml,xmlreader,xmlwriter,xsl,pdo_mysql,Zend OPcache')

        console.log(`Everything is okay ;)`)
        await deployer.chat.notify(`All tests passed! Everything is okay ;)`, {color: 'green'})
    })

