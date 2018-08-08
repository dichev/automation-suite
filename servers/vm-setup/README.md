# vm-setup
### known-hosts

```
  Usage: node servers/vm-setup/known-hosts --hosts <list|all> 

  Options:
    -h, --hosts <list|all>  [required] The target host names. Available: belgium-lb,belgium-mysql-master,belgium-web1,belgium-web2,cdn-asia,cdn-backup,cdn-europe,data-warehouse,dev-hermes-lb,dev-hermes-sql,dev-hermes-web1,dev-hermes-web2,france-srv1,gib-lb,gib-mysql,gib-mysql-archive,gib-mysql-slave,gib-srv1,gib-srv2,gib-srv3,gib-web1,gib-web2,gib-web3,gib-web4,gib-web5,iom-java1,iom-java2,iom-lb,iom-mysql,iom-mysql-archive,iom-mysql-slave,iom-srv1,iom-srv2,iom-srv3,iom-srv4,iom-system,iom-web1,iom-web2,iom-web3,iom-web4,iom-web5,malta-srv1,manila-lb,manila-mysql,manila-mysql-archive,manila-mysql-slave,manila-mysql-staging,manila-srv1,manila-srv2,manila-srv3,manila-system,manila-web1,manila-web2,manila-web3,manila-web4,manila-web5,monitoring,pokerstars-lb,pokerstars-lb-staging,pokerstars-mysql,pokerstars-mysql-archive,pokerstars-mysql-slave,pokerstars-mysql-staging,pokerstars-system,pokerstars-web1,pokerstars-web2,pokerstars-web3,pokerstars-web4,pokerstars-web5,sofia-central-sql,sofia-mysql-backup-gib,sofia-mysql-backup-gib-archive,sofia-mysql-backup-iom,sofia-mysql-backup-iom-archive,sofia-mysql-backup-manila,sofia-mysql-backup-manila-archive,sofia-mysql-backup-pokerstars,sofia-mysql-backup-pokerstars-archive,sofia-mysql-backup-tw,sofia-mysql-backup-tw-archive,sofia-mysql-mirror-belgium,sofia-mysql-mirror-gib,sofia-mysql-mirror-gib-new,sofia-mysql-mirror-iom,sofia-mysql-mirror-iom-new,sofia-mysql-mirror-manila,sofia-mysql-mirror-manila-new,sofia-mysql-mirror-pokerstars,sofia-mysql-mirror-pokerstars-new,sofia-mysql-mirror-tw,sofia-mysql-mirror-tw-new,tw-lb,tw-mysql,tw-mysql2,tw-mysql-archive,tw-mysql-archive2,tw-mysql-slave,tw-mysql-slave2,tw-web1,tw-web2,tw-web3,tw-web4,tw-web5,office-dns

  Additional Options:
    -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose           Turn ON log details of whats happening
    -f, --force             Suppress confirm messages (used for automation)
    -n, --dry-run           Dry run mode will do everything as usual except commands execution
    -q, --quiet             Turn off chat and some logs in stdout
    --no-chat               Disable chat notification if they are activated
    -h, --help              output usage information
```
