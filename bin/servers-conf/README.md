# servers-conf
### list-changes

```
node bin/servers-conf/list-changes --help

  Usage: list-changes --locations <list|all> 

  Options:

    -l, --locations <list|all>  [required] The target host name Available: dev,gib,manila,taiwan,pokerstars,iom,belgium
    -p, --parallel [limit]      When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose               Turn ON log details of whats happening
    -f, --force                 Suppress confirm messages (used for automation)
    -n, --dry-run               Dry run mode will do everything as usual except commands execution
    -q, --quiet                 Turn off chat and some logs in stdout
    -h, --help                  output usage information
```
### update
Auto update sever configurations by reloading one by one each server
```
node bin/servers-conf/update --help

  Usage: update --locations <list|all> 

  Auto update sever configurations by reloading one by one each server

  Options:

    -l, --locations <list|all>  [required] The target host name Available: dev,gib,manila,taiwan,pokerstars,iom,belgium
    -r, --rev <string>          Specify target git revision, very useful for rollback. Default reset to origin/master
    -i, --interval <int>        How many seconds to wait between each configuration switch. Default is 2
    -f, --force                 Skip manual changes validations and proceed on your risk
    --no-wait                   Skip waiting for active php processes to end and other safety delays. WARNING: this will break current php processes in the middle of their execution causing strange errors.
    --only-nginx                Update all configurations but restarts only the nginx service (so php-fpm will be not updated)
    --with-nginx-upgrade        Update all configurations but restarts only the nginx service USING UPGRADE method (so php-fpm will be not updated)
    -p, --parallel [limit]      When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose               Turn ON log details of whats happening
    -f, --force                 Suppress confirm messages (used for automation)
    -n, --dry-run               Dry run mode will do everything as usual except commands execution
    -q, --quiet                 Turn off chat and some logs in stdout
    -h, --help                  output usage information
```
