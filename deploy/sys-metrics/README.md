# sys-metrics
### check

```
  Usage: node deploy/sys-metrics/check --hosts <list|all> 

  Options:
    -h, --hosts <list|all>  [required] The target host names. Available: git,sofia-mysql-backup-pokerstars,sofia-mysql-backup-manila,sofia-mysql-backup-iom,sofia-mysql-backup-manial-taiwan,sofia-mysql-mirror-pokerstars,sofia-mysql-mirror-manila-taiwan,sofia-mysql-mirror-manila,sofia-mysql-mirror-iom,sofia-mysql-mirror-gib,sofia-mysql-backup-pokerstars-archive,sofia-mysql-backup-manila-archive,sofia-mysql-backup-iom-archive,sofia-mysql-backup-gib-archive,sofia-mysql-backup-gib,sofia-logserver,sofia-syslog,dev-hermes-lb,dev-hermes-sql,dev-hermes-web1,dev-hermes-web2,france-srv1,cdn-europe,cdn-asia,cdn-backup,pokerstars-web1,pokerstars-web2,pokerstars-web3,pokerstars-web4,pokerstars-web5,pokerstars-lb1,pokerstars-lb2,pokerstars-system,pokerstars-sql1,pokerstars-sql2,pokerstars-sql3,pokerstars-mysql-archive,iom-lb,iom-mysql-new,iom-mysql-archive,iom-slave,iom-web1,iom-web2,iom-web3,iom-web4,iom-web5,iom-system,iom-3thparty-web1,iom-3thparty-web2,gib-lb1,gib-web1,gib-web2,gib-web3,gib-web4,gib-web5,gib-mysql,gib-mysql-slave,gib-mysql-archive,manila-lb,manila-mysql,manila-mysql-archive,manila-slave,manila-system,manila-web1,manila-web2,manila-web3,manila-web4,manila-web5,manila-tw-mysql,manila-tw-mysql-archive,tw-lb,tw-mysql,tw-mysql-archive,tw-mysql-slave,tw-web1,tw-web2,tw-web3,tw-web4,tw-web5,belgium-lb,belgium-mysql,belgium-web1,belgium-web2,data-warehouse,tw-mysql2,tw-mysql-archive2

  Additional Options:
    -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose           Turn ON log details of whats happening
    -f, --force             Suppress confirm messages (used for automation)
    -n, --dry-run           Dry run mode will do everything as usual except commands execution
    -q, --quiet             Turn off chat and some logs in stdout
    --no-chat               Disable chat notification if they are activated
    -h, --help              output usage information

  Example usage:
    node deploy/sys-metrics/check --hosts dev-hermes-web1,dev-hermes-web2
    node deploy/sys-metrics/check --hosts dev-hermes-*
    node deploy/sys-metrics/check --hosts all
```
### init
Installing sys-metrics
```
  Usage: node deploy/sys-metrics/init --hosts <list> 

  Installing sys-metrics

  Options:
    -h, --hosts <list>      [required] The target host names

  Additional Options:
    -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose           Turn ON log details of whats happening
    -f, --force             Suppress confirm messages (used for automation)
    -n, --dry-run           Dry run mode will do everything as usual except commands execution
    -q, --quiet             Turn off chat and some logs in stdout
    --no-chat               Disable chat notification if they are activated
    -h, --help              output usage information
```
### restart

```
  Usage: node deploy/sys-metrics/restart --hosts <list|all> 

  Options:
    -h, --hosts <list|all>  [required] The target host names. Available: git,sofia-mysql-backup-pokerstars,sofia-mysql-backup-manila,sofia-mysql-backup-iom,sofia-mysql-backup-manial-taiwan,sofia-mysql-mirror-pokerstars,sofia-mysql-mirror-manila-taiwan,sofia-mysql-mirror-manila,sofia-mysql-mirror-iom,sofia-mysql-mirror-gib,sofia-mysql-backup-pokerstars-archive,sofia-mysql-backup-manila-archive,sofia-mysql-backup-iom-archive,sofia-mysql-backup-gib-archive,sofia-mysql-backup-gib,sofia-logserver,sofia-syslog,dev-hermes-lb,dev-hermes-sql,dev-hermes-web1,dev-hermes-web2,france-srv1,cdn-europe,cdn-asia,cdn-backup,pokerstars-web1,pokerstars-web2,pokerstars-web3,pokerstars-web4,pokerstars-web5,pokerstars-lb1,pokerstars-lb2,pokerstars-system,pokerstars-sql1,pokerstars-sql2,pokerstars-sql3,pokerstars-mysql-archive,iom-lb,iom-mysql-new,iom-mysql-archive,iom-slave,iom-web1,iom-web2,iom-web3,iom-web4,iom-web5,iom-system,iom-3thparty-web1,iom-3thparty-web2,gib-lb1,gib-web1,gib-web2,gib-web3,gib-web4,gib-web5,gib-mysql,gib-mysql-slave,gib-mysql-archive,manila-lb,manila-mysql,manila-mysql-archive,manila-slave,manila-system,manila-web1,manila-web2,manila-web3,manila-web4,manila-web5,manila-tw-mysql,manila-tw-mysql-archive,tw-lb,tw-mysql,tw-mysql-archive,tw-mysql-slave,tw-web1,tw-web2,tw-web3,tw-web4,tw-web5,belgium-lb,belgium-mysql,belgium-web1,belgium-web2,data-warehouse,tw-mysql2,tw-mysql-archive2

  Additional Options:
    -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose           Turn ON log details of whats happening
    -f, --force             Suppress confirm messages (used for automation)
    -n, --dry-run           Dry run mode will do everything as usual except commands execution
    -q, --quiet             Turn off chat and some logs in stdout
    --no-chat               Disable chat notification if they are activated
    -h, --help              output usage information
```
### stop

```
  Usage: node deploy/sys-metrics/stop --hosts <list|all> 

  Options:
    -h, --hosts <list|all>  [required] The target host names. Available: git,sofia-mysql-backup-pokerstars,sofia-mysql-backup-manila,sofia-mysql-backup-iom,sofia-mysql-backup-manial-taiwan,sofia-mysql-mirror-pokerstars,sofia-mysql-mirror-manila-taiwan,sofia-mysql-mirror-manila,sofia-mysql-mirror-iom,sofia-mysql-mirror-gib,sofia-mysql-backup-pokerstars-archive,sofia-mysql-backup-manila-archive,sofia-mysql-backup-iom-archive,sofia-mysql-backup-gib-archive,sofia-mysql-backup-gib,sofia-logserver,sofia-syslog,dev-hermes-lb,dev-hermes-sql,dev-hermes-web1,dev-hermes-web2,france-srv1,cdn-europe,cdn-asia,cdn-backup,pokerstars-web1,pokerstars-web2,pokerstars-web3,pokerstars-web4,pokerstars-web5,pokerstars-lb1,pokerstars-lb2,pokerstars-system,pokerstars-sql1,pokerstars-sql2,pokerstars-sql3,pokerstars-mysql-archive,iom-lb,iom-mysql-new,iom-mysql-archive,iom-slave,iom-web1,iom-web2,iom-web3,iom-web4,iom-web5,iom-system,iom-3thparty-web1,iom-3thparty-web2,gib-lb1,gib-web1,gib-web2,gib-web3,gib-web4,gib-web5,gib-mysql,gib-mysql-slave,gib-mysql-archive,manila-lb,manila-mysql,manila-mysql-archive,manila-slave,manila-system,manila-web1,manila-web2,manila-web3,manila-web4,manila-web5,manila-tw-mysql,manila-tw-mysql-archive,tw-lb,tw-mysql,tw-mysql-archive,tw-mysql-slave,tw-web1,tw-web2,tw-web3,tw-web4,tw-web5,belgium-lb,belgium-mysql,belgium-web1,belgium-web2,data-warehouse,tw-mysql2,tw-mysql-archive2

  Additional Options:
    -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose           Turn ON log details of whats happening
    -f, --force             Suppress confirm messages (used for automation)
    -n, --dry-run           Dry run mode will do everything as usual except commands execution
    -q, --quiet             Turn off chat and some logs in stdout
    --no-chat               Disable chat notification if they are activated
    -h, --help              output usage information
```
### update
Updating sys-metrics version
```
  Usage: node deploy/sys-metrics/update --hosts <list|all> --rev <tag> 

  Updating sys-metrics version

  Options:
    -h, --hosts <list|all>  [required] The target host names. Available: git,sofia-mysql-backup-pokerstars,sofia-mysql-backup-manila,sofia-mysql-backup-iom,sofia-mysql-backup-manial-taiwan,sofia-mysql-mirror-pokerstars,sofia-mysql-mirror-manila-taiwan,sofia-mysql-mirror-manila,sofia-mysql-mirror-iom,sofia-mysql-mirror-gib,sofia-mysql-backup-pokerstars-archive,sofia-mysql-backup-manila-archive,sofia-mysql-backup-iom-archive,sofia-mysql-backup-gib-archive,sofia-mysql-backup-gib,sofia-logserver,sofia-syslog,dev-hermes-lb,dev-hermes-sql,dev-hermes-web1,dev-hermes-web2,france-srv1,cdn-europe,cdn-asia,cdn-backup,pokerstars-web1,pokerstars-web2,pokerstars-web3,pokerstars-web4,pokerstars-web5,pokerstars-lb1,pokerstars-lb2,pokerstars-system,pokerstars-sql1,pokerstars-sql2,pokerstars-sql3,pokerstars-mysql-archive,iom-lb,iom-mysql-new,iom-mysql-archive,iom-slave,iom-web1,iom-web2,iom-web3,iom-web4,iom-web5,iom-system,iom-3thparty-web1,iom-3thparty-web2,gib-lb1,gib-web1,gib-web2,gib-web3,gib-web4,gib-web5,gib-mysql,gib-mysql-slave,gib-mysql-archive,manila-lb,manila-mysql,manila-mysql-archive,manila-slave,manila-system,manila-web1,manila-web2,manila-web3,manila-web4,manila-web5,manila-tw-mysql,manila-tw-mysql-archive,tw-lb,tw-mysql,tw-mysql-archive,tw-mysql-slave,tw-web1,tw-web2,tw-web3,tw-web4,tw-web5,belgium-lb,belgium-mysql,belgium-web1,belgium-web2,data-warehouse,tw-mysql2,tw-mysql-archive2
    -r, --rev <tag>         [required] The target version as tag name

  Additional Options:
    -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose           Turn ON log details of whats happening
    -f, --force             Suppress confirm messages (used for automation)
    -n, --dry-run           Dry run mode will do everything as usual except commands execution
    -q, --quiet             Turn off chat and some logs in stdout
    --no-chat               Disable chat notification if they are activated
    -h, --help              output usage information
```
