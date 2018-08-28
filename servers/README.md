## Available programs:

* **[cloudflare](#cloudflare)**
    * **[check](#cloudflare-check)** - check current cloudflare configuration
    * **[get](#cloudflare-get)** - get specific cloudflare configuration from all zones
    * **[unify-page-rules](#cloudflare-unify-page-rules)** - unifying cloudflare page rules
    * **[unify-pages](#cloudflare-unify-pages)** - unifying cloudflare custom pages
    * **[unify-settings](#cloudflare-unify-settings)** - unifying cloudflare custom settings
* **[php-binary](#php-binary)**
    * **[check](#php-binary-check)** 
    * **[init](#php-binary-init)** 
* **[servers-conf](#servers-conf)**
    * **[list-changes](#servers-conf-list-changes)** 
    * **[update](#servers-conf-update)** - auto update sever configurations by reloading one by one each server
* **[vm-setup](#vm-setup)**
    * **[dnsmasq](#vm-setup-dnsmasq)** - setup dnsmasq configuration of the webs
    * **[known-hosts](#vm-setup-known-hosts)** 
    * **[logrotate](#vm-setup-logrotate)** - setup logrotate configurations

## Help
## <a name="cloudflare"></a>cloudflare
### <a name="cloudflare-check"></a>check
Check current cloudflare configuration
```
  Usage: node servers/cloudflare/check --zones <list|all> 

  Check current cloudflare configuration

  Options:
    -z, --zones <list|all>  [required] Comma-separated list of cloudflare zone aliases. Available: dopamine-gaming.com,rtggib.cash,tgp.cash,redtiger.cash,m-gservices.com,redtiger-demo.com

  Additional Options:
    -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose           Turn ON log details of whats happening
    -f, --force             Suppress confirm messages (used for automation)
    -n, --dry-run           Dry run mode will do everything as usual except commands execution
    -q, --quiet             Turn off chat and some logs in stdout
    --no-chat               Disable chat notification if they are activated
    -h, --help              output usage information
```
### <a name="cloudflare-get"></a>get
Get specific cloudflare configuration from all zones
```
  Usage: node servers/cloudflare/get --zones <list|all> 

  Get specific cloudflare configuration from all zones

  Options:
    -z, --zones <list|all>  [required] Comma-separated list of cloudflare zone aliases. Available: dopamine-gaming.com,rtggib.cash,tgp.cash,redtiger.cash,m-gservices.com,redtiger-demo.com
    -u, --url <string>      Cloudflare url without the zone part (default: settings/security_level)

  Additional Options:
    -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose           Turn ON log details of whats happening
    -f, --force             Suppress confirm messages (used for automation)
    -n, --dry-run           Dry run mode will do everything as usual except commands execution
    -q, --quiet             Turn off chat and some logs in stdout
    --no-chat               Disable chat notification if they are activated
    -h, --help              output usage information
```
### <a name="cloudflare-unify-page-rules"></a>unify-page-rules
Unifying cloudflare page rules
```
  Usage: node servers/cloudflare/unify-page-rules --zones <list|all> 

  Unifying cloudflare page rules

  Options:
    -z, --zones <list|all>  [required] Comma-separated list of cloudflare zone aliases. Available: dopamine-gaming.com,rtggib.cash,tgp.cash,redtiger.cash,m-gservices.com,redtiger-demo.com

  Additional Options:
    -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose           Turn ON log details of whats happening
    -f, --force             Suppress confirm messages (used for automation)
    -n, --dry-run           Dry run mode will do everything as usual except commands execution
    -q, --quiet             Turn off chat and some logs in stdout
    --no-chat               Disable chat notification if they are activated
    -h, --help              output usage information
```
### <a name="cloudflare-unify-pages"></a>unify-pages
Unifying cloudflare custom pages
```
  Usage: node servers/cloudflare/unify-pages --zones <list|all> 

  Unifying cloudflare custom pages

  Options:
    -z, --zones <list|all>  [required] Comma-separated list of cloudflare zone aliases. Available: dopamine-gaming.com,rtggib.cash,tgp.cash,redtiger.cash,m-gservices.com,redtiger-demo.com

  Additional Options:
    -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose           Turn ON log details of whats happening
    -f, --force             Suppress confirm messages (used for automation)
    -n, --dry-run           Dry run mode will do everything as usual except commands execution
    -q, --quiet             Turn off chat and some logs in stdout
    --no-chat               Disable chat notification if they are activated
    -h, --help              output usage information
```
### <a name="cloudflare-unify-settings"></a>unify-settings
Unifying cloudflare custom settings
```
  Usage: node servers/cloudflare/unify-settings --zones <list|all> 

  Unifying cloudflare custom settings

  Options:
    -z, --zones <list|all>  [required] Comma-separated list of cloudflare zone aliases. Available: dopamine-gaming.com,rtggib.cash,tgp.cash,redtiger.cash,m-gservices.com,redtiger-demo.com

  Additional Options:
    -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose           Turn ON log details of whats happening
    -f, --force             Suppress confirm messages (used for automation)
    -n, --dry-run           Dry run mode will do everything as usual except commands execution
    -q, --quiet             Turn off chat and some logs in stdout
    --no-chat               Disable chat notification if they are activated
    -h, --help              output usage information
```
## <a name="php-binary"></a>php-binary
### <a name="php-binary-check"></a>check

```
  Usage: node servers/php-binary/check --hosts <list|all> 

  Options:
    -h, --hosts <list|all>  [required] The target host name. Available: dev-hermes-web1,dev-hermes-web2,belgium-web1,belgium-web2,manila-web1,manila-web2,manila-web3,manila-web4,manila-web5,iom-web1,iom-web2,iom-web3,iom-web4,iom-web5,tw-web1,tw-web2,tw-web3,tw-web4,tw-web5,gib-web1,gib-web2,gib-web3,gib-web4,gib-web5,pokerstars-web1,pokerstars-web2,pokerstars-web3,pokerstars-web4,pokerstars-web5

  Additional Options:
    -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose           Turn ON log details of whats happening
    -f, --force             Suppress confirm messages (used for automation)
    -n, --dry-run           Dry run mode will do everything as usual except commands execution
    -q, --quiet             Turn off chat and some logs in stdout
    --no-chat               Disable chat notification if they are activated
    -h, --help              output usage information
```
### <a name="php-binary-init"></a>init

```
  Usage: node servers/php-binary/init --hosts <list|all> --phpversion <version> 

  Options:
    -h, --hosts <list|all>      [required] The target host name. Available: dev-hermes-web1,dev-hermes-web2,belgium-web1,belgium-web2,manila-web1,manila-web2,manila-web3,manila-web4,manila-web5,iom-web1,iom-web2,iom-web3,iom-web4,iom-web5,tw-web1,tw-web2,tw-web3,tw-web4,tw-web5,gib-web1,gib-web2,gib-web3,gib-web4,gib-web5,pokerstars-web1,pokerstars-web2,pokerstars-web3,pokerstars-web4,pokerstars-web5
    -p, --phpversion <version>  [required] The php version number. Available: 7.1.19,7.1.20,7.2.6 (default: 7.1.20)

  Additional Options:
    -p, --parallel [limit]      When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose               Turn ON log details of whats happening
    -f, --force                 Suppress confirm messages (used for automation)
    -n, --dry-run               Dry run mode will do everything as usual except commands execution
    -q, --quiet                 Turn off chat and some logs in stdout
    --no-chat                   Disable chat notification if they are activated
    -h, --help                  output usage information
```
## <a name="servers-conf"></a>servers-conf
### <a name="servers-conf-list-changes"></a>list-changes

```
  Usage: node servers/servers-conf/list-changes --locations <list|all> 

  Options:
    -l, --locations <list|all>  [required] The target host name. Available: dev,gib,taiwan,pokerstars,iom,belgium

  Additional Options:
    -p, --parallel [limit]      When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose               Turn ON log details of whats happening
    -f, --force                 Suppress confirm messages (used for automation)
    -n, --dry-run               Dry run mode will do everything as usual except commands execution
    -q, --quiet                 Turn off chat and some logs in stdout
    --no-chat                   Disable chat notification if they are activated
    -h, --help                  output usage information
```
### <a name="servers-conf-update"></a>update
Auto update sever configurations by reloading one by one each server
```
  Usage: node servers/servers-conf/update --locations <list|all> 

  Auto update sever configurations by reloading one by one each server

  Options:
    -l, --locations <list|all>  [required] The target host name. Available: dev,gib,taiwan,pokerstars,iom,belgium
    -r, --rev <string>          Specify target git revision, very useful for rollback. Default reset to origin/master
    -i, --interval <int>        How many seconds to wait between each configuration switch. Default is 2
    -f, --force                 Skip manual changes validations and proceed on your risk
    --no-wait                   Skip waiting for active php processes to end and other safety delays. WARNING: this will break current php processes in the middle of their execution causing strange errors.
    --only-nginx                Update all configurations but restarts only the nginx service (so php-fpm will be not updated)
    --with-nginx-upgrade        Update all configurations but restarts only the nginx service USING UPGRADE method (so php-fpm will be not updated)

  Additional Options:
    -p, --parallel [limit]      When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose               Turn ON log details of whats happening
    -f, --force                 Suppress confirm messages (used for automation)
    -n, --dry-run               Dry run mode will do everything as usual except commands execution
    -q, --quiet                 Turn off chat and some logs in stdout
    --no-chat                   Disable chat notification if they are activated
    -h, --help                  output usage information
```
## <a name="vm-setup"></a>vm-setup
### <a name="vm-setup-dnsmasq"></a>dnsmasq
Setup dnsmasq configuration of the webs
```
  Usage: node servers/vm-setup/dnsmasq --hosts <list|all> 

  Setup dnsmasq configuration of the webs

  Options:
    -h, --hosts <list|all>  [required] The target host names. Available: belgium-lb,belgium-mysql-master,belgium-web1,belgium-web2,malta-mysql-belgium-replication,cdn-asia,cdn-backup,cdn-europe,cdn-staging,data-warehouse,dev-hermes-lb,dev-hermes-sql,dev-hermes-web1,dev-hermes-web2,france-srv1,gib-lb,gib-mysql,gib-mysql-archive,gib-mysql-slave,gib-srv1,gib-srv2,gib-srv3,gib-web1,gib-web2,gib-web3,gib-web4,gib-web5,iom-java1,iom-java2,iom-lb,iom-mysql,iom-mysql-archive,iom-mysql-slave,iom-srv1,iom-srv2,iom-srv3,iom-srv4,iom-system,iom-web1,iom-web2,iom-web3,iom-web4,iom-web5,malta-srv1,manila-lb,manila-mysql,manila-mysql-archive,manila-mysql-slave,manila-mysql-staging,manila-srv1,manila-srv2,manila-srv3,manila-system,manila-web1,manila-web2,manila-web3,manila-web4,manila-web5,monitoring,pokerstars-lb,pokerstars-lb-staging,pokerstars-mysql,pokerstars-mysql-archive,pokerstars-mysql-slave,pokerstars-mysql-staging,pokerstars-system,pokerstars-web1,pokerstars-web2,pokerstars-web3,pokerstars-web4,pokerstars-web5,sofia-central-sql,sofia-mysql-backup-gib,sofia-mysql-backup-gib-archive,sofia-mysql-backup-iom,sofia-mysql-backup-iom-archive,sofia-mysql-backup-manila,sofia-mysql-backup-manila-archive,sofia-mysql-backup-pokerstars,sofia-mysql-backup-pokerstars-archive,sofia-mysql-backup-tw,sofia-mysql-backup-tw-archive,sofia-mysql-mirror-belgium,sofia-mysql-mirror-gib,sofia-mysql-mirror-gib-new,sofia-mysql-mirror-iom,sofia-mysql-mirror-iom-new,sofia-mysql-mirror-manila,sofia-mysql-mirror-manila-new,sofia-mysql-mirror-pokerstars,sofia-mysql-mirror-pokerstars-new,sofia-mysql-mirror-tw,sofia-mysql-mirror-tw-new,tw-lb,tw-mysql,tw-mysql2,tw-mysql-archive,tw-mysql-archive2,tw-mysql-slave,tw-mysql-slave2,tw-web1,tw-web2,tw-web3,tw-web4,tw-web5,office-dns

  Additional Options:
    -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose           Turn ON log details of whats happening
    -f, --force             Suppress confirm messages (used for automation)
    -n, --dry-run           Dry run mode will do everything as usual except commands execution
    -q, --quiet             Turn off chat and some logs in stdout
    --no-chat               Disable chat notification if they are activated
    -h, --help              output usage information
```
### <a name="vm-setup-known-hosts"></a>known-hosts

```
  Usage: node servers/vm-setup/known-hosts --hosts <list|all> 

  Options:
    -h, --hosts <list|all>  [required] The target host names. Available: belgium-lb,belgium-mysql-master,belgium-web1,belgium-web2,malta-mysql-belgium-replication,cdn-asia,cdn-backup,cdn-europe,cdn-staging,data-warehouse,dev-hermes-lb,dev-hermes-sql,dev-hermes-web1,dev-hermes-web2,france-srv1,gib-lb,gib-mysql,gib-mysql-archive,gib-mysql-slave,gib-srv1,gib-srv2,gib-srv3,gib-web1,gib-web2,gib-web3,gib-web4,gib-web5,iom-java1,iom-java2,iom-lb,iom-mysql,iom-mysql-archive,iom-mysql-slave,iom-srv1,iom-srv2,iom-srv3,iom-srv4,iom-system,iom-web1,iom-web2,iom-web3,iom-web4,iom-web5,malta-srv1,manila-lb,manila-mysql,manila-mysql-archive,manila-mysql-slave,manila-mysql-staging,manila-srv1,manila-srv2,manila-srv3,manila-system,manila-web1,manila-web2,manila-web3,manila-web4,manila-web5,monitoring,pokerstars-lb,pokerstars-lb-staging,pokerstars-mysql,pokerstars-mysql-archive,pokerstars-mysql-slave,pokerstars-mysql-staging,pokerstars-system,pokerstars-web1,pokerstars-web2,pokerstars-web3,pokerstars-web4,pokerstars-web5,sofia-central-sql,sofia-mysql-backup-gib,sofia-mysql-backup-gib-archive,sofia-mysql-backup-iom,sofia-mysql-backup-iom-archive,sofia-mysql-backup-manila,sofia-mysql-backup-manila-archive,sofia-mysql-backup-pokerstars,sofia-mysql-backup-pokerstars-archive,sofia-mysql-backup-tw,sofia-mysql-backup-tw-archive,sofia-mysql-mirror-belgium,sofia-mysql-mirror-gib,sofia-mysql-mirror-gib-new,sofia-mysql-mirror-iom,sofia-mysql-mirror-iom-new,sofia-mysql-mirror-manila,sofia-mysql-mirror-manila-new,sofia-mysql-mirror-pokerstars,sofia-mysql-mirror-pokerstars-new,sofia-mysql-mirror-tw,sofia-mysql-mirror-tw-new,tw-lb,tw-mysql,tw-mysql2,tw-mysql-archive,tw-mysql-archive2,tw-mysql-slave,tw-mysql-slave2,tw-web1,tw-web2,tw-web3,tw-web4,tw-web5,office-dns

  Additional Options:
    -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose           Turn ON log details of whats happening
    -f, --force             Suppress confirm messages (used for automation)
    -n, --dry-run           Dry run mode will do everything as usual except commands execution
    -q, --quiet             Turn off chat and some logs in stdout
    --no-chat               Disable chat notification if they are activated
    -h, --help              output usage information
```
### <a name="vm-setup-logrotate"></a>logrotate
Setup logrotate configurations
```
  Usage: node servers/vm-setup/logrotate --hosts <list> 

  Setup logrotate configurations

  Options:
    -h, --hosts <list>      [required] The target host names. Available: belgium-lb,belgium-mysql-master,belgium-web1,belgium-web2,malta-mysql-belgium-replication,cdn-asia,cdn-backup,cdn-europe,cdn-staging,data-warehouse,dev-hermes-lb,dev-hermes-sql,dev-hermes-web1,dev-hermes-web2,france-srv1,gib-lb,gib-mysql,gib-mysql-archive,gib-mysql-slave,gib-srv1,gib-srv2,gib-srv3,gib-web1,gib-web2,gib-web3,gib-web4,gib-web5,iom-java1,iom-java2,iom-lb,iom-mysql,iom-mysql-archive,iom-mysql-slave,iom-srv1,iom-srv2,iom-srv3,iom-srv4,iom-system,iom-web1,iom-web2,iom-web3,iom-web4,iom-web5,malta-srv1,manila-lb,manila-mysql,manila-mysql-archive,manila-mysql-slave,manila-mysql-staging,manila-srv1,manila-srv2,manila-srv3,manila-system,manila-web1,manila-web2,manila-web3,manila-web4,manila-web5,monitoring,pokerstars-lb,pokerstars-lb-staging,pokerstars-mysql,pokerstars-mysql-archive,pokerstars-mysql-slave,pokerstars-mysql-staging,pokerstars-system,pokerstars-web1,pokerstars-web2,pokerstars-web3,pokerstars-web4,pokerstars-web5,sofia-central-sql,sofia-mysql-backup-gib,sofia-mysql-backup-gib-archive,sofia-mysql-backup-iom,sofia-mysql-backup-iom-archive,sofia-mysql-backup-manila,sofia-mysql-backup-manila-archive,sofia-mysql-backup-pokerstars,sofia-mysql-backup-pokerstars-archive,sofia-mysql-backup-tw,sofia-mysql-backup-tw-archive,sofia-mysql-mirror-belgium,sofia-mysql-mirror-gib,sofia-mysql-mirror-gib-new,sofia-mysql-mirror-iom,sofia-mysql-mirror-iom-new,sofia-mysql-mirror-manila,sofia-mysql-mirror-manila-new,sofia-mysql-mirror-pokerstars,sofia-mysql-mirror-pokerstars-new,sofia-mysql-mirror-tw,sofia-mysql-mirror-tw-new,tw-lb,tw-mysql,tw-mysql2,tw-mysql-archive,tw-mysql-archive2,tw-mysql-slave,tw-mysql-slave2,tw-web1,tw-web2,tw-web3,tw-web4,tw-web5,office-dns
    --only-validate         Perform just validation of the current logrotate configuration

  Additional Options:
    -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose           Turn ON log details of whats happening
    -f, --force             Suppress confirm messages (used for automation)
    -n, --dry-run           Dry run mode will do everything as usual except commands execution
    -q, --quiet             Turn off chat and some logs in stdout
    --no-chat               Disable chat notification if they are activated
    -h, --help              output usage information
```
