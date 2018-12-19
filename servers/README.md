## Available programs:

* **[backup](#backup)**
    * **[run](#backup-run)** - setup backups
    * **[setup](#backup-setup)** - setup backups
* **[cloudflare](#cloudflare)**
    * **[check](#cloudflare-check)** - check current cloudflare configuration
    * **[get](#cloudflare-get)** - get specific cloudflare configuration from all zones
    * **[unify-page-rules](#cloudflare-unify-page-rules)** - unifying cloudflare page rules
    * **[unify-pages](#cloudflare-unify-pages)** - unifying cloudflare custom pages
    * **[unify-settings](#cloudflare-unify-settings)** - unifying cloudflare custom settings
* **[docker](#docker)**
    * **[setup](#docker-setup)** - setup docker on all web instances
* **[executor](#executor)**
    * **[exec-by-operator](#executor-exec-by-operator)** - execute any command on over the base directory of any operator
    * **[exec](#executor-exec)** - execute any command on any host
* **[fraud](#fraud)**
    * **[block-jp-displayer](#fraud-block-jp-displayer)** - auto Block the &quot;JP Displayer bot&quot; for fun - will be banned NOT immediately but in random periods bet..
* **[gcloud](#gcloud)**
    * **[change-dns](#gcloud-change-dns)** - set ip to all gserver/gpanel dns records of the zone
    * **[check-operators](#gcloud-check-operators)** 
    * **[create-dns](#gcloud-create-dns)** - set ip to all gserver/gpanel dns records of the zone
    * **[setup-all-vm](#gcloud-setup-all-vm)** - setup unified server configurations
* **[monitoring](#monitoring)**
    * **[init-mysqld-exporter](#monitoring-init-mysqld-exporter)** - setup monitoring: Mysqld Exporter
    * **[init-nodejs-exporter](#monitoring-init-nodejs-exporter)** - setup monitoring: Node Exporter
* **[mysql-conf](#mysql-conf)**
    * **[fetch-configs](#mysql-conf-fetch-configs)** - generate server-conf for specific location
    * **[fetch-dynamic-configs](#mysql-conf-fetch-dynamic-configs)** - generate server-conf for specific location
    * **[setup](#mysql-conf-setup)** - setup unified mysql configuration
    * **[update](#mysql-conf-update)** - setup unified mysql configuration
    * **[upgrade-package](#mysql-conf-upgrade-package)** - upgrade percona mysql package to it&#x27;s latest version
* **[php-binary](#php-binary)**
    * **[check](#php-binary-check)** 
    * **[init](#php-binary-init)** 
* **[servers-conf](#servers-conf)**
    * **[init](#servers-conf-init)** - setup unified server configurations
    * **[list-changes](#servers-conf-list-changes)** 
    * **[update](#servers-conf-update)** - auto update sever configurations by reloading one by one each server
* **[tinyproxy](#tinyproxy)**
    * **[setstate](#tinyproxy-setstate)** - switch proxy state [in/active] for operator[s]
    * **[setup](#tinyproxy-setup)** - tiny proxy setup.
* **[vm-setup](#vm-setup)**
    * **[add-ssh-key](#vm-setup-add-ssh-key)** - safely add ssh public key to multiple hosts
    * **[dnsmasq](#vm-setup-dnsmasq)** - setup dnsmasq configuration of the webs
    * **[known-hosts](#vm-setup-known-hosts)** 
    * **[logrotate](#vm-setup-logrotate)** - setup logrotate configurations
    * **[rsyslog](#vm-setup-rsyslog)** - setup logrotate configurations

## Help
## <a name="backup"></a>backup
### <a name="backup-run"></a>run
Setup backups
```
Usage: node servers/backup/run --hosts <list|all> --type <list|all> 

Setup backups

Options:
  -h, --hosts <list|all>  [required] The target host names
  -t, --type <list|all>   [required] The target host names

Additional Options:
  -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
  -v, --verbose           Turn ON log details of whats happening
  -f, --force             Suppress confirm messages (used for automation)
  --dry-run               Dry run mode will do everything as usual except commands execution
  --quiet                 Turn off chat and some logs in stdout
  --wait <int>            Pause between iterations in seconds
  --announce              Announce what and why is happening and delay the execution to give time to all to prepare
  --no-chat               Disable chat notification if they are activated
  -h, --help              output usage information
```
### <a name="backup-setup"></a>setup
Setup backups
```
Usage: node servers/backup/setup --hosts <list|all> 

Setup backups

Options:
  -h, --hosts <list|all>  [required] The target host names

Additional Options:
  -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
  -v, --verbose           Turn ON log details of whats happening
  -f, --force             Suppress confirm messages (used for automation)
  --dry-run               Dry run mode will do everything as usual except commands execution
  --quiet                 Turn off chat and some logs in stdout
  --wait <int>            Pause between iterations in seconds
  --announce              Announce what and why is happening and delay the execution to give time to all to prepare
  --no-chat               Disable chat notification if they are activated
  -h, --help              output usage information
```
## <a name="cloudflare"></a>cloudflare
### <a name="cloudflare-check"></a>check
Check current cloudflare configuration
```
Usage: node servers/cloudflare/check --zones <list|all> 

Check current cloudflare configuration

Options:
  -z, --zones <list|all>  [required] Comma-separated list of cloudflare zone aliases

Additional Options:
  -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
  -v, --verbose           Turn ON log details of whats happening
  -f, --force             Suppress confirm messages (used for automation)
  --dry-run               Dry run mode will do everything as usual except commands execution
  --quiet                 Turn off chat and some logs in stdout
  --wait <int>            Pause between iterations in seconds
  --announce              Announce what and why is happening and delay the execution to give time to all to prepare
  --no-chat               Disable chat notification if they are activated
  -h, --help              output usage information
```
### <a name="cloudflare-get"></a>get
Get specific cloudflare configuration from all zones
```
Usage: node servers/cloudflare/get --zones <list|all> 

Get specific cloudflare configuration from all zones

Options:
  -z, --zones <list|all>  [required] Comma-separated list of cloudflare zone aliases
  -u, --url <string>      Cloudflare url without the zone part (default: "settings/security_level")

Additional Options:
  -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
  -v, --verbose           Turn ON log details of whats happening
  -f, --force             Suppress confirm messages (used for automation)
  --dry-run               Dry run mode will do everything as usual except commands execution
  --quiet                 Turn off chat and some logs in stdout
  --wait <int>            Pause between iterations in seconds
  --announce              Announce what and why is happening and delay the execution to give time to all to prepare
  --no-chat               Disable chat notification if they are activated
  -h, --help              output usage information
```
### <a name="cloudflare-unify-page-rules"></a>unify-page-rules
Unifying cloudflare page rules
```
Usage: node servers/cloudflare/unify-page-rules --zones <list|all> 

Unifying cloudflare page rules

Options:
  -z, --zones <list|all>  [required] Comma-separated list of cloudflare zone aliases

Additional Options:
  -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
  -v, --verbose           Turn ON log details of whats happening
  -f, --force             Suppress confirm messages (used for automation)
  --dry-run               Dry run mode will do everything as usual except commands execution
  --quiet                 Turn off chat and some logs in stdout
  --wait <int>            Pause between iterations in seconds
  --announce              Announce what and why is happening and delay the execution to give time to all to prepare
  --no-chat               Disable chat notification if they are activated
  -h, --help              output usage information
```
### <a name="cloudflare-unify-pages"></a>unify-pages
Unifying cloudflare custom pages
```
Usage: node servers/cloudflare/unify-pages --zones <list|all> 

Unifying cloudflare custom pages

Options:
  -z, --zones <list|all>  [required] Comma-separated list of cloudflare zone aliases

Additional Options:
  -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
  -v, --verbose           Turn ON log details of whats happening
  -f, --force             Suppress confirm messages (used for automation)
  --dry-run               Dry run mode will do everything as usual except commands execution
  --quiet                 Turn off chat and some logs in stdout
  --wait <int>            Pause between iterations in seconds
  --announce              Announce what and why is happening and delay the execution to give time to all to prepare
  --no-chat               Disable chat notification if they are activated
  -h, --help              output usage information
```
### <a name="cloudflare-unify-settings"></a>unify-settings
Unifying cloudflare custom settings
```
Usage: node servers/cloudflare/unify-settings --zones <list|all> 

Unifying cloudflare custom settings

Options:
  -z, --zones <list|all>  [required] Comma-separated list of cloudflare zone aliases

Additional Options:
  -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
  -v, --verbose           Turn ON log details of whats happening
  -f, --force             Suppress confirm messages (used for automation)
  --dry-run               Dry run mode will do everything as usual except commands execution
  --quiet                 Turn off chat and some logs in stdout
  --wait <int>            Pause between iterations in seconds
  --announce              Announce what and why is happening and delay the execution to give time to all to prepare
  --no-chat               Disable chat notification if they are activated
  -h, --help              output usage information
```
## <a name="docker"></a>docker
### <a name="docker-setup"></a>setup
Setup docker on all web instances
```
Usage: node servers/docker/setup --hosts <list|all> 

Setup docker on all web instances

Options:
  -h, --hosts <list|all>  [required] The target host name

Additional Options:
  -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
  -v, --verbose           Turn ON log details of whats happening
  -f, --force             Suppress confirm messages (used for automation)
  --dry-run               Dry run mode will do everything as usual except commands execution
  --quiet                 Turn off chat and some logs in stdout
  --wait <int>            Pause between iterations in seconds
  --announce              Announce what and why is happening and delay the execution to give time to all to prepare
  --no-chat               Disable chat notification if they are activated
  -h, --help              output usage information
```
## <a name="executor"></a>executor
### <a name="executor-exec-by-operator"></a>exec-by-operator
Execute any command on over the base directory of any operator
```
Usage: node servers/executor/exec-by-operator --operators <list|all> 

Execute any command on over the base directory of any operator

Options:
  -o, --operators <list|all>  [required] Comma-separated list of operators
  -e, --exec <cmd>            Command to be executed
  -E, --exec-file <file>      Read remote commands from file
  --no-history                Disable saving commands to history (useful for credentials data)

Additional Options:
  -p, --parallel [limit]      When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
  -v, --verbose               Turn ON log details of whats happening
  -f, --force                 Suppress confirm messages (used for automation)
  --dry-run                   Dry run mode will do everything as usual except commands execution
  --quiet                     Turn off chat and some logs in stdout
  --wait <int>                Pause between iterations in seconds
  --announce                  Announce what and why is happening and delay the execution to give time to all to prepare
  --no-chat                   Disable chat notification if they are activated
  -h, --help                  output usage information
```
### <a name="executor-exec"></a>exec
Execute any command on any host
```
Usage: node servers/executor/exec --hosts <list> 

Execute any command on any host

Options:
  -h, --hosts <list>      [required] The target host names
  -u, --user <name>       Choose ssh user (default: "root")
  -e, --exec <cmd>        Command to be executed
  -E, --exec-file <file>  Read remote commands from file
  --no-history            Disable saving commands to history (useful for credentials data)

Additional Options:
  -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
  -v, --verbose           Turn ON log details of whats happening
  -f, --force             Suppress confirm messages (used for automation)
  --dry-run               Dry run mode will do everything as usual except commands execution
  --quiet                 Turn off chat and some logs in stdout
  --wait <int>            Pause between iterations in seconds
  --announce              Announce what and why is happening and delay the execution to give time to all to prepare
  --no-chat               Disable chat notification if they are activated
  -h, --help              output usage information
```
## <a name="fraud"></a>fraud
### <a name="fraud-block-jp-displayer"></a>block-jp-displayer
Auto Block the &quot;JP Displayer bot&quot; for fun - will be banned NOT immediately but in random periods between 5m - 15m just to look like human action
```
Usage: node servers/fraud/block-jp-displayer [options]

Auto Block the "JP Displayer bot" for fun - will be banned NOT immediately but in random periods between 5m - 15m just to look like human action

Options:

Additional Options:
  -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
  -v, --verbose           Turn ON log details of whats happening
  -f, --force             Suppress confirm messages (used for automation)
  --dry-run               Dry run mode will do everything as usual except commands execution
  --quiet                 Turn off chat and some logs in stdout
  --wait <int>            Pause between iterations in seconds
  --announce              Announce what and why is happening and delay the execution to give time to all to prepare
  --no-chat               Disable chat notification if they are activated
  -h, --help              output usage information
```
## <a name="gcloud"></a>gcloud
### <a name="gcloud-change-dns"></a>change-dns
Set ip to all gserver/gpanel dns records of the zone
```
Usage: node servers/gcloud/change-dns --zones <list|all> 

Set ip to all gserver/gpanel dns records of the zone

Options:
  -z, --zones <list|all>  [required] Comma-separated list of cloudflare zone aliases
  --update                Update dns records, otherwise just list them

Additional Options:
  -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
  -v, --verbose           Turn ON log details of whats happening
  -f, --force             Suppress confirm messages (used for automation)
  --dry-run               Dry run mode will do everything as usual except commands execution
  --quiet                 Turn off chat and some logs in stdout
  --wait <int>            Pause between iterations in seconds
  --announce              Announce what and why is happening and delay the execution to give time to all to prepare
  --no-chat               Disable chat notification if they are activated
  -h, --help              output usage information
```
### <a name="gcloud-check-operators"></a>check-operators

```
Usage: node servers/gcloud/check-operators --locations <name> 

Options:
  -l, --locations <name>  [required] The target location name

Additional Options:
  -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
  -v, --verbose           Turn ON log details of whats happening
  -f, --force             Suppress confirm messages (used for automation)
  --dry-run               Dry run mode will do everything as usual except commands execution
  --quiet                 Turn off chat and some logs in stdout
  --wait <int>            Pause between iterations in seconds
  --announce              Announce what and why is happening and delay the execution to give time to all to prepare
  --no-chat               Disable chat notification if they are activated
  -h, --help              output usage information
```
### <a name="gcloud-create-dns"></a>create-dns
Set ip to all gserver/gpanel dns records of the zone
```
Usage: node servers/gcloud/create-dns --zones <list|all> 

Set ip to all gserver/gpanel dns records of the zone

Options:
  -z, --zones <list|all>  [required] Comma-separated list of cloudflare zone aliases
  --update                Update dns records, otherwise just list them

Additional Options:
  -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
  -v, --verbose           Turn ON log details of whats happening
  -f, --force             Suppress confirm messages (used for automation)
  --dry-run               Dry run mode will do everything as usual except commands execution
  --quiet                 Turn off chat and some logs in stdout
  --wait <int>            Pause between iterations in seconds
  --announce              Announce what and why is happening and delay the execution to give time to all to prepare
  --no-chat               Disable chat notification if they are activated
  -h, --help              output usage information
```
### <a name="gcloud-setup-all-vm"></a>setup-all-vm
Setup unified server configurations
```
Usage: node servers/gcloud/setup-all-vm --location <name> 

Setup unified server configurations

Options:
  -l, --location <name>   [required] The target location name

Additional Options:
  -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
  -v, --verbose           Turn ON log details of whats happening
  -f, --force             Suppress confirm messages (used for automation)
  --dry-run               Dry run mode will do everything as usual except commands execution
  --quiet                 Turn off chat and some logs in stdout
  --wait <int>            Pause between iterations in seconds
  --announce              Announce what and why is happening and delay the execution to give time to all to prepare
  --no-chat               Disable chat notification if they are activated
  -h, --help              output usage information
```
## <a name="monitoring"></a>monitoring
### <a name="monitoring-init-mysqld-exporter"></a>init-mysqld-exporter
Setup monitoring: Mysqld Exporter
```
Usage: node servers/monitoring/init-mysqld-exporter --hosts <list|all> --networks <list|all> 

Setup monitoring: Mysqld Exporter

Options:
  -h, --hosts <list|all>     [required] The target host names
  -n, --networks <list|all>  [required] Networks
  -f, --force                Skip manual changes validations and proceed on your risk

Additional Options:
  -p, --parallel [limit]     When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
  -v, --verbose              Turn ON log details of whats happening
  -f, --force                Suppress confirm messages (used for automation)
  --dry-run                  Dry run mode will do everything as usual except commands execution
  --quiet                    Turn off chat and some logs in stdout
  --wait <int>               Pause between iterations in seconds
  --announce                 Announce what and why is happening and delay the execution to give time to all to prepare
  --no-chat                  Disable chat notification if they are activated
  -h, --help                 output usage information
```
### <a name="monitoring-init-nodejs-exporter"></a>init-nodejs-exporter
Setup monitoring: Node Exporter
```
Usage: node servers/monitoring/init-nodejs-exporter --hosts <list|all> --networks <list|all> 

Setup monitoring: Node Exporter

Options:
  -h, --hosts <list|all>     [required] The target host names
  -n, --networks <list|all>  [required] Networks
  -f, --force                Skip manual changes validations and proceed on your risk

Additional Options:
  -p, --parallel [limit]     When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
  -v, --verbose              Turn ON log details of whats happening
  -f, --force                Suppress confirm messages (used for automation)
  --dry-run                  Dry run mode will do everything as usual except commands execution
  --quiet                    Turn off chat and some logs in stdout
  --wait <int>               Pause between iterations in seconds
  --announce                 Announce what and why is happening and delay the execution to give time to all to prepare
  --no-chat                  Disable chat notification if they are activated
  -h, --help                 output usage information
```
## <a name="mysql-conf"></a>mysql-conf
### <a name="mysql-conf-fetch-configs"></a>fetch-configs
Generate server-conf for specific location
```
Usage: node servers/mysql-conf/fetch-configs --hosts <list|all> 

Generate server-conf for specific location

Options:
  -h, --hosts <list|all>  [required] The target host name
  -d, --dest <path>       Output generated data to destination path

Additional Options:
  -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
  -v, --verbose           Turn ON log details of whats happening
  -f, --force             Suppress confirm messages (used for automation)
  --dry-run               Dry run mode will do everything as usual except commands execution
  --quiet                 Turn off chat and some logs in stdout
  --wait <int>            Pause between iterations in seconds
  --announce              Announce what and why is happening and delay the execution to give time to all to prepare
  --no-chat               Disable chat notification if they are activated
  -h, --help              output usage information
```
### <a name="mysql-conf-fetch-dynamic-configs"></a>fetch-dynamic-configs
Generate server-conf for specific location
```
Usage: node servers/mysql-conf/fetch-dynamic-configs --hosts <list|all> 

Generate server-conf for specific location

Options:
  -h, --hosts <list|all>  [required] The target host name
  -d, --dest <path>       Output generated data to destination path

Additional Options:
  -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
  -v, --verbose           Turn ON log details of whats happening
  -f, --force             Suppress confirm messages (used for automation)
  --dry-run               Dry run mode will do everything as usual except commands execution
  --quiet                 Turn off chat and some logs in stdout
  --wait <int>            Pause between iterations in seconds
  --announce              Announce what and why is happening and delay the execution to give time to all to prepare
  --no-chat               Disable chat notification if they are activated
  -h, --help              output usage information
```
### <a name="mysql-conf-setup"></a>setup
Setup unified mysql configuration
```
Usage: node servers/mysql-conf/setup --hosts <list|all> 

Setup unified mysql configuration

Options:
  -h, --hosts <list|all>  [required] The target host name

Additional Options:
  -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
  -v, --verbose           Turn ON log details of whats happening
  -f, --force             Suppress confirm messages (used for automation)
  --dry-run               Dry run mode will do everything as usual except commands execution
  --quiet                 Turn off chat and some logs in stdout
  --wait <int>            Pause between iterations in seconds
  --announce              Announce what and why is happening and delay the execution to give time to all to prepare
  --no-chat               Disable chat notification if they are activated
  -h, --help              output usage information
```
### <a name="mysql-conf-update"></a>update
Setup unified mysql configuration
```
Usage: node servers/mysql-conf/update --hosts <list|all> 

Setup unified mysql configuration

Options:
  -h, --hosts <list|all>  [required] The target host name
  --mode <restart|fetch>  Restart mysql server or just fetch the changes (will be applied on next restart)
  --query <sql>           Execute SQL command after the update (to apply global setting change without restart), for example: "SET GLOBAL expire_logs_days = 5"
  --reset                 Reset manual changes

Additional Options:
  -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
  -v, --verbose           Turn ON log details of whats happening
  -f, --force             Suppress confirm messages (used for automation)
  --dry-run               Dry run mode will do everything as usual except commands execution
  --quiet                 Turn off chat and some logs in stdout
  --wait <int>            Pause between iterations in seconds
  --announce              Announce what and why is happening and delay the execution to give time to all to prepare
  --no-chat               Disable chat notification if they are activated
  -h, --help              output usage information
```
### <a name="mysql-conf-upgrade-package"></a>upgrade-package
Upgrade percona mysql package to it&#x27;s latest version
```
Usage: node servers/mysql-conf/upgrade-package --hosts <list|all> 

Upgrade percona mysql package to it's latest version

Options:
  -h, --hosts <list|all>  [required] The target host name

Additional Options:
  -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
  -v, --verbose           Turn ON log details of whats happening
  -f, --force             Suppress confirm messages (used for automation)
  --dry-run               Dry run mode will do everything as usual except commands execution
  --quiet                 Turn off chat and some logs in stdout
  --wait <int>            Pause between iterations in seconds
  --announce              Announce what and why is happening and delay the execution to give time to all to prepare
  --no-chat               Disable chat notification if they are activated
  -h, --help              output usage information
```
## <a name="php-binary"></a>php-binary
### <a name="php-binary-check"></a>check

```
Usage: node servers/php-binary/check --hosts <list|all> 

Options:
  -h, --hosts <list|all>  [required] The target host name

Additional Options:
  -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
  -v, --verbose           Turn ON log details of whats happening
  -f, --force             Suppress confirm messages (used for automation)
  --dry-run               Dry run mode will do everything as usual except commands execution
  --quiet                 Turn off chat and some logs in stdout
  --wait <int>            Pause between iterations in seconds
  --announce              Announce what and why is happening and delay the execution to give time to all to prepare
  --no-chat               Disable chat notification if they are activated
  -h, --help              output usage information
```
### <a name="php-binary-init"></a>init

```
Usage: node servers/php-binary/init --hosts <list|all> 

Options:
  -h, --hosts <list|all>  [required] The target host name

Additional Options:
  -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
  -v, --verbose           Turn ON log details of whats happening
  -f, --force             Suppress confirm messages (used for automation)
  --dry-run               Dry run mode will do everything as usual except commands execution
  --quiet                 Turn off chat and some logs in stdout
  --wait <int>            Pause between iterations in seconds
  --announce              Announce what and why is happening and delay the execution to give time to all to prepare
  --no-chat               Disable chat notification if they are activated
  -h, --help              output usage information
```
## <a name="servers-conf"></a>servers-conf
### <a name="servers-conf-init"></a>init
Setup unified server configurations
```
Usage: node servers/servers-conf/init --hosts <list|all> 

Setup unified server configurations

Options:
  -h, --hosts <list|all>  [required] The target host name

Additional Options:
  -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
  -v, --verbose           Turn ON log details of whats happening
  -f, --force             Suppress confirm messages (used for automation)
  --dry-run               Dry run mode will do everything as usual except commands execution
  --quiet                 Turn off chat and some logs in stdout
  --wait <int>            Pause between iterations in seconds
  --announce              Announce what and why is happening and delay the execution to give time to all to prepare
  --no-chat               Disable chat notification if they are activated
  -h, --help              output usage information
```
### <a name="servers-conf-list-changes"></a>list-changes

```
Usage: node servers/servers-conf/list-changes --locations <list|all> 

Options:
  -l, --locations <list|all>  [required] The target location name

Additional Options:
  -p, --parallel [limit]      When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
  -v, --verbose               Turn ON log details of whats happening
  -f, --force                 Suppress confirm messages (used for automation)
  --dry-run                   Dry run mode will do everything as usual except commands execution
  --quiet                     Turn off chat and some logs in stdout
  --wait <int>                Pause between iterations in seconds
  --announce                  Announce what and why is happening and delay the execution to give time to all to prepare
  --no-chat                   Disable chat notification if they are activated
  -h, --help                  output usage information
```
### <a name="servers-conf-update"></a>update
Auto update sever configurations by reloading one by one each server
```
Usage: node servers/servers-conf/update --locations <list|all> 

Auto update sever configurations by reloading one by one each server

Options:
  -l, --locations <list|all>                      [required] The target host name
  -r, --rev <string>                              Specify target git revision, very useful for rollback. Default reset to origin/master
  -i, --interval <int>                            How many seconds to wait between each configuration switch. Default is 2
  -f, --force                                     Skip manual changes validations and proceed on your risk
  --no-wait-webs                                  Skip waiting for active php processes to end and other safety delays. WARNING: this will break current php processes in the middle of their execution causing strange errors.
  --reload <nginx|webs|nginx-with-upgrade|proxy>  Reload nginx service or webs php-fpm

Additional Options:
  -p, --parallel [limit]                          When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
  -v, --verbose                                   Turn ON log details of whats happening
  -f, --force                                     Suppress confirm messages (used for automation)
  --dry-run                                       Dry run mode will do everything as usual except commands execution
  --quiet                                         Turn off chat and some logs in stdout
  --wait <int>                                    Pause between iterations in seconds
  --announce                                      Announce what and why is happening and delay the execution to give time to all to prepare
  --no-chat                                       Disable chat notification if they are activated
  -h, --help                                      output usage information
```
## <a name="tinyproxy"></a>tinyproxy
### <a name="tinyproxy-setstate"></a>setstate
Switch proxy state [in/active] for operator[s]
```
Usage: node servers/tinyproxy/setstate --operators <list|all> --state <string> 

Switch proxy state [in/active] for operator[s]

Options:
  -o, --operators <list|all>  [required] Comma-separated list of operators
  -s, --state <string>        [required] Desired state for this operator [active,inactive]

Additional Options:
  -p, --parallel [limit]      When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
  -v, --verbose               Turn ON log details of whats happening
  -f, --force                 Suppress confirm messages (used for automation)
  --dry-run                   Dry run mode will do everything as usual except commands execution
  --quiet                     Turn off chat and some logs in stdout
  --wait <int>                Pause between iterations in seconds
  --announce                  Announce what and why is happening and delay the execution to give time to all to prepare
  --no-chat                   Disable chat notification if they are activated
  -h, --help                  output usage information
```
### <a name="tinyproxy-setup"></a>setup
Tiny proxy setup.
```
Usage: node servers/tinyproxy/setup --locations <list|all> 

Tiny proxy setup.

Options:
  -l, --locations <list|all>  [required] Location

Additional Options:
  -p, --parallel [limit]      When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
  -v, --verbose               Turn ON log details of whats happening
  -f, --force                 Suppress confirm messages (used for automation)
  --dry-run                   Dry run mode will do everything as usual except commands execution
  --quiet                     Turn off chat and some logs in stdout
  --wait <int>                Pause between iterations in seconds
  --announce                  Announce what and why is happening and delay the execution to give time to all to prepare
  --no-chat                   Disable chat notification if they are activated
  -h, --help                  output usage information
```
## <a name="vm-setup"></a>vm-setup
### <a name="vm-setup-add-ssh-key"></a>add-ssh-key
Safely add ssh public key to multiple hosts
```
Usage: node servers/vm-setup/add-ssh-key --hosts <list|all> --user <dopamine|root> 

Safely add ssh public key to multiple hosts

Options:
  -h, --hosts <list|all>      [required] The target host names
  -u, --user <dopamine|root>  [required] The key will be added for this user

Additional Options:
  -p, --parallel [limit]      When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
  -v, --verbose               Turn ON log details of whats happening
  -f, --force                 Suppress confirm messages (used for automation)
  --dry-run                   Dry run mode will do everything as usual except commands execution
  --quiet                     Turn off chat and some logs in stdout
  --wait <int>                Pause between iterations in seconds
  --announce                  Announce what and why is happening and delay the execution to give time to all to prepare
  --no-chat                   Disable chat notification if they are activated
  -h, --help                  output usage information
```
### <a name="vm-setup-dnsmasq"></a>dnsmasq
Setup dnsmasq configuration of the webs
```
Usage: node servers/vm-setup/dnsmasq --hosts <list|all> 

Setup dnsmasq configuration of the webs

Options:
  -h, --hosts <list|all>  [required] The target host names

Additional Options:
  -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
  -v, --verbose           Turn ON log details of whats happening
  -f, --force             Suppress confirm messages (used for automation)
  --dry-run               Dry run mode will do everything as usual except commands execution
  --quiet                 Turn off chat and some logs in stdout
  --wait <int>            Pause between iterations in seconds
  --announce              Announce what and why is happening and delay the execution to give time to all to prepare
  --no-chat               Disable chat notification if they are activated
  -h, --help              output usage information
```
### <a name="vm-setup-known-hosts"></a>known-hosts

```
Usage: node servers/vm-setup/known-hosts --hosts <list|all> 

Options:
  -h, --hosts <list|all>  [required] The target host names

Additional Options:
  -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
  -v, --verbose           Turn ON log details of whats happening
  -f, --force             Suppress confirm messages (used for automation)
  --dry-run               Dry run mode will do everything as usual except commands execution
  --quiet                 Turn off chat and some logs in stdout
  --wait <int>            Pause between iterations in seconds
  --announce              Announce what and why is happening and delay the execution to give time to all to prepare
  --no-chat               Disable chat notification if they are activated
  -h, --help              output usage information
```
### <a name="vm-setup-logrotate"></a>logrotate
Setup logrotate configurations
```
Usage: node servers/vm-setup/logrotate --hosts <list> 

Setup logrotate configurations

Options:
  -h, --hosts <list>      [required] The target host names
  --only-validate         Perform just validation of the current logrotate configuration

Additional Options:
  -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
  -v, --verbose           Turn ON log details of whats happening
  -f, --force             Suppress confirm messages (used for automation)
  --dry-run               Dry run mode will do everything as usual except commands execution
  --quiet                 Turn off chat and some logs in stdout
  --wait <int>            Pause between iterations in seconds
  --announce              Announce what and why is happening and delay the execution to give time to all to prepare
  --no-chat               Disable chat notification if they are activated
  -h, --help              output usage information
```
### <a name="vm-setup-rsyslog"></a>rsyslog
Setup logrotate configurations
```
Usage: node servers/vm-setup/rsyslog --hosts <list> 

Setup logrotate configurations

Options:
  -h, --hosts <list>      [required] The target host names
  --only-validate         Perform just validation of the current logrotate configuration

Additional Options:
  -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
  -v, --verbose           Turn ON log details of whats happening
  -f, --force             Suppress confirm messages (used for automation)
  --dry-run               Dry run mode will do everything as usual except commands execution
  --quiet                 Turn off chat and some logs in stdout
  --wait <int>            Pause between iterations in seconds
  --announce              Announce what and why is happening and delay the execution to give time to all to prepare
  --no-chat               Disable chat notification if they are activated
  -h, --help              output usage information
```
