# php-binary
### 

```
node bin/php-binary/check --help

  Usage: check --hosts <list|all> 

  Options:

    -h, --hosts <list|all>  [required] The target host name Available: dev-hermes-web1,dev-hermes-web2,belgium-web1,belgium-web2,manila-web1,manila-web2,manila-web3,manila-web4,manila-web5,iom-web1,iom-web2,iom-web3,iom-web4,iom-web5,tw-web1,tw-web2,tw-web3,tw-web4,tw-web5,gib-web1,gib-web2,gib-web3,gib-web4,gib-web5,pokerstars-web1,pokerstars-web2,pokerstars-web3,pokerstars-web4,pokerstars-web5
    -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose           Turn ON log details of whats happening
    -f, --force             Suppress confirm messages (used for automation)
    -n, --dry-run           Dry run mode will do everything as usual except commands execution
    -q, --quiet             Turn off chat and some logs in stdout
    -h, --help              output usage information
```
### 

```
node bin/php-binary/init --help

  Usage: init --hosts <list|all> --phpversion <version> 

  Options:

    -h, --hosts <list|all>      [required] The target host name Available: dev-hermes-web1,dev-hermes-web2,belgium-web1,belgium-web2,manila-web1,manila-web2,manila-web3,manila-web4,manila-web5,iom-web1,iom-web2,iom-web3,iom-web4,iom-web5,tw-web1,tw-web2,tw-web3,tw-web4,tw-web5,gib-web1,gib-web2,gib-web3,gib-web4,gib-web5,pokerstars-web1,pokerstars-web2,pokerstars-web3,pokerstars-web4,pokerstars-web5
    -p, --phpversion <version>  [required] The php version number Available: 7.1.19,7.1.20,7.2.6 (default: 7.1.20)
    -p, --parallel [limit]      When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose               Turn ON log details of whats happening
    -f, --force                 Suppress confirm messages (used for automation)
    -n, --dry-run               Dry run mode will do everything as usual except commands execution
    -q, --quiet                 Turn off chat and some logs in stdout
    -h, --help                  output usage information
```
