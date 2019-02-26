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
    * **[mysql-exec](#executor-mysql-exec)** - execute any command on any host
    * **[stats](#executor-stats)** - show server stats
* **[fraud](#fraud)**
    * **[block-jp-displayer](#fraud-block-jp-displayer)** - auto Block the &quot;JP Displayer bot&quot; for fun - will be banned NOT immediately but in random periods bet..
* **[gcloud](#gcloud)**
    * **[change-dns](#gcloud-change-dns)** - set ip to all gserver/gpanel dns records of the zone
    * **[check-operators](#gcloud-check-operators)** 
    * **[create-dns](#gcloud-create-dns)** - set ip to all gserver/gpanel dns records of the zone
    * **[resize-vm-mysql](#gcloud-resize-vm-mysql)** - resize master mysql VM on Google Cloud with minimal downtime
    * **[resize-vm-web](#gcloud-resize-vm-web)** - resize webs VM on Google Cloud without downtime
    * **[setup-all-vm](#gcloud-setup-all-vm)** - setup unified server configurations
* **[monitoring](#monitoring)**
    * **[init-mysqld-exporter](#monitoring-init-mysqld-exporter)** - setup monitoring: Mysqld Exporter
    * **[init-node-exporter](#monitoring-init-node-exporter)** - setup monitoring: Node Exporter
* **[mysql-conf](#mysql-conf)**
    * **[fetch-configs](#mysql-conf-fetch-configs)** - generate server-conf for specific location
    * **[fetch-dynamic-configs](#mysql-conf-fetch-dynamic-configs)** - generate server-conf for specific location
    * **[list-changes](#mysql-conf-list-changes)** - check for not applied changes in mysql server repo
    * **[setup](#mysql-conf-setup)** - setup unified mysql configuration
    * **[update](#mysql-conf-update)** - update mysql configuration
    * **[upgrade-package](#mysql-conf-upgrade-package)** - upgrade percona mysql package to it&#x27;s latest version
* **[nginx](#nginx)**
    * **[disable-operators](#nginx-disable-operators)** - enable/disable nginx access to operators on specific location
    * **[switch-webs-by-location](#nginx-switch-webs-by-location)** - switch between webs used by locations
    * **[switch-webs-by-operator](#nginx-switch-webs-by-operator)** - switch between webs used by the operators
    * **[whitelist-check](#nginx-whitelist-check)** - list ips for operator
    * **[whitelist](#nginx-whitelist)** - whitelist ips for operator
* **[php-binary](#php-binary)**
    * **[check](#php-binary-check)** 
    * **[init](#php-binary-init)** 
* **[proxy](#proxy)**
    * **[check-state](#proxy-check-state)** - check proxy states by location
    * **[setstate](#proxy-setstate)** - switch proxy state [in/active] for operator[s]
    * **[setup](#proxy-setup)** - proxy setup.
* **[servers-conf](#servers-conf)**
    * **[init](#servers-conf-init)** - setup unified server configurations
    * **[list-changes](#servers-conf-list-changes)** 
    * **[update-cdn](#servers-conf-update-cdn)** - update servers configuration of CDN
    * **[update](#servers-conf-update)** - auto update sever configurations by reloading one by one each server
* **[ssh](#ssh)**
    * **[config-generator](#ssh-config-generator)** - generate ssh_config file
* **[ssh-keys](#ssh-keys)**
    * **[add](#ssh-keys-add)** - safely add ssh public key to multiple hosts
    * **[list](#ssh-keys-list)** - list current ssh keys of multiple hosts
    * **[remove](#ssh-keys-remove)** - safely REMOVE ssh public key to multiple hosts
* **[vm-setup](#vm-setup)**
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
### <a name="executor-mysql-exec"></a>mysql-exec
Execute any command on any host
```
Usage: node servers/executor/mysql-exec --hosts <list> 

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
### <a name="executor-stats"></a>stats
Show server stats
```
Usage: node servers/executor/stats --hosts <list|all> 

Show server stats

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
### <a name="gcloud-resize-vm-mysql"></a>resize-vm-mysql
Resize master mysql VM on Google Cloud with minimal downtime
```
Usage: node servers/gcloud/resize-vm-mysql --hosts <list|all> 

Resize master mysql VM on Google Cloud with minimal downtime

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
### <a name="gcloud-resize-vm-web"></a>resize-vm-web
Resize webs VM on Google Cloud without downtime
```
Usage: node servers/gcloud/resize-vm-web --hosts <list|all> 

Resize webs VM on Google Cloud without downtime

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
### <a name="monitoring-init-node-exporter"></a>init-node-exporter
Setup monitoring: Node Exporter
```
Usage: node servers/monitoring/init-node-exporter --hosts <list|all> --networks <list|all> 

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
### <a name="mysql-conf-list-changes"></a>list-changes
Check for not applied changes in mysql server repo
```
Usage: node servers/mysql-conf/list-changes --hosts <list|all> 

Check for not applied changes in mysql server repo

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
Update mysql configuration
```
Usage: node servers/mysql-conf/update --hosts <list|all> --mode <restart|fetch> 

Update mysql configuration

Options:
  -h, --hosts <list|all>  [required] The target host name
  --mode <restart|fetch>  [required] Restart mysql server or just fetch the changes (will be applied on next restart)
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
## <a name="nginx"></a>nginx
### <a name="nginx-disable-operators"></a>disable-operators
Enable/disable nginx access to operators on specific location
```
Usage: node servers/nginx/disable-operators --locations <list|all> --operators <list|all> 

Enable/disable nginx access to operators on specific location

Options:
  -l, --locations <list|all>    [required] The target host name
  -o, --operators <list|all>    [required] Comma-separated list of operators
  --filter-by-databases <name>  Filter operators by databases name
  --enable                      Toggle to reenable them

Additional Options:
  -p, --parallel [limit]        When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
  -v, --verbose                 Turn ON log details of whats happening
  -f, --force                   Suppress confirm messages (used for automation)
  --dry-run                     Dry run mode will do everything as usual except commands execution
  --quiet                       Turn off chat and some logs in stdout
  --wait <int>                  Pause between iterations in seconds
  --announce                    Announce what and why is happening and delay the execution to give time to all to prepare
  --no-chat                     Disable chat notification if they are activated
  -h, --help                    output usage information
```
### <a name="nginx-switch-webs-by-location"></a>switch-webs-by-location
Switch between webs used by locations
```
Usage: node servers/nginx/switch-webs-by-location --webs <webs|all> --locations <location|all> 

Switch between webs used by locations

Options:
  -w, --webs <webs|all>           [required] Comma-separated list on which webs to be executed
  -l, --locations <location|all>  [required] Comma-separated list of location (this wil filter the operators in defined location)
  --exclude-webs <webs>           Comma-separated list on which webs to be EXCLUDED from the --webs list

Additional Options:
  -p, --parallel [limit]          When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
  -v, --verbose                   Turn ON log details of whats happening
  -f, --force                     Suppress confirm messages (used for automation)
  --dry-run                       Dry run mode will do everything as usual except commands execution
  --quiet                         Turn off chat and some logs in stdout
  --wait <int>                    Pause between iterations in seconds
  --announce                      Announce what and why is happening and delay the execution to give time to all to prepare
  --no-chat                       Disable chat notification if they are activated
  -h, --help                      output usage information

  Example usage:
    $ switch-webs --webs=all  --operators=all
    $ switch-webs --webs=web1 --operators=all
    $ switch-webs --webs=all  --operators=all --exclude-webs=web1,web2
    $ switch-webs --webs=web1,web2 --operators=rtg,bots --no-reload
```
### <a name="nginx-switch-webs-by-operator"></a>switch-webs-by-operator
Switch between webs used by the operators
```
Usage: node servers/nginx/switch-webs-by-operator --webs <webs|all> --operators <operators|all> 

Switch between webs used by the operators

Options:
  -w, --webs <webs|all>            [required] Comma-separated list on which webs to be executed
  -o, --operators <operators|all>  [required] Comma-separated list on which operators to be executed
  --exclude-webs <webs>            Comma-separated list on which webs to be EXCLUDED from the --webs list

Additional Options:
  -p, --parallel [limit]           When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
  -v, --verbose                    Turn ON log details of whats happening
  -f, --force                      Suppress confirm messages (used for automation)
  --dry-run                        Dry run mode will do everything as usual except commands execution
  --quiet                          Turn off chat and some logs in stdout
  --wait <int>                     Pause between iterations in seconds
  --announce                       Announce what and why is happening and delay the execution to give time to all to prepare
  --no-chat                        Disable chat notification if they are activated
  -h, --help                       output usage information

  Example usage:
    $ switch-webs --webs=all  --operators=all
    $ switch-webs --webs=web1 --operators=all
    $ switch-webs --webs=all  --operators=all --exclude-webs=web1,web2
    $ switch-webs --webs=web1,web2 --operators=rtg,bots --no-reload
```
### <a name="nginx-whitelist-check"></a>whitelist-check
List ips for operator
```
Usage: node servers/nginx/whitelist-check --operators <list|all> 

List ips for operator

Options:
  -o, --operators <list|all>  [required] Comma-separated list of operators

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
### <a name="nginx-whitelist"></a>whitelist
Whitelist ips for operator
```
Usage: node servers/nginx/whitelist --tasks <list> 

Whitelist ips for operator

Options:
  -t, --tasks <list>      [required] Task to be processed

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
## <a name="proxy"></a>proxy
### <a name="proxy-check-state"></a>check-state
Check proxy states by location
```
Usage: node servers/proxy/check-state --locations <list|all> 

Check proxy states by location

Options:
  -l, --locations <list|all>  [required] Comma-separated list of Locations

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
### <a name="proxy-setstate"></a>setstate
Switch proxy state [in/active] for operator[s]
```
Usage: node servers/proxy/setstate --operators <list|all> --state <string> 

Switch proxy state [in/active] for operator[s]

Options:
  -o, --operators <list|all>   [required] Comma-separated list of operators
  -s, --state <string>         [required] Desired state for this operator [active,inactive]
  --filter-by-location <name>  Filter operators by location name

Additional Options:
  -p, --parallel [limit]       When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
  -v, --verbose                Turn ON log details of whats happening
  -f, --force                  Suppress confirm messages (used for automation)
  --dry-run                    Dry run mode will do everything as usual except commands execution
  --quiet                      Turn off chat and some logs in stdout
  --wait <int>                 Pause between iterations in seconds
  --announce                   Announce what and why is happening and delay the execution to give time to all to prepare
  --no-chat                    Disable chat notification if they are activated
  -h, --help                   output usage information
```
### <a name="proxy-setup"></a>setup
Proxy setup.
```
Usage: node servers/proxy/setup --locations <list|all> 

Proxy setup.

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
### <a name="servers-conf-update-cdn"></a>update-cdn
Update servers configuration of CDN
```
Usage: node servers/servers-conf/update-cdn --hosts <list|all> 

Update servers configuration of CDN

Options:
  -h, --hosts <list|all>   [required] Comma-separated list of cdn regions
  -r, --revision <string>  Target git revision or branch (default: "origin/master")
  -f, --force              Skip manual changes validations and proceed on your risk

Additional Options:
  -p, --parallel [limit]   When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
  -v, --verbose            Turn ON log details of whats happening
  -f, --force              Suppress confirm messages (used for automation)
  --dry-run                Dry run mode will do everything as usual except commands execution
  --quiet                  Turn off chat and some logs in stdout
  --wait <int>             Pause between iterations in seconds
  --announce               Announce what and why is happening and delay the execution to give time to all to prepare
  --no-chat                Disable chat notification if they are activated
  -h, --help               output usage information
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
## <a name="ssh"></a>ssh
### <a name="ssh-config-generator"></a>config-generator
generate ssh_config file
```
Usage: node servers/ssh/config-generator --hosts <list|all> 

generate ssh_config file

Options:
  -u, --user <string>      User for remote login
  -i, --identity <string>  Identity file location
  -h, --hosts <list|all>   [required] Comma-separated list of hosts

Additional Options:
  -p, --parallel [limit]   When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
  -v, --verbose            Turn ON log details of whats happening
  -f, --force              Suppress confirm messages (used for automation)
  --dry-run                Dry run mode will do everything as usual except commands execution
  --quiet                  Turn off chat and some logs in stdout
  --wait <int>             Pause between iterations in seconds
  --announce               Announce what and why is happening and delay the execution to give time to all to prepare
  --no-chat                Disable chat notification if they are activated
  -h, --help               output usage information
```
## <a name="ssh-keys"></a>ssh-keys
### <a name="ssh-keys-add"></a>add
Safely add ssh public key to multiple hosts
```
Usage: node servers/ssh-keys/add --hosts <list|all> --user <dopamine|root> 

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
### <a name="ssh-keys-list"></a>list
List current ssh keys of multiple hosts
```
Usage: node servers/ssh-keys/list --hosts <list|all> 

List current ssh keys of multiple hosts

Options:
  -h, --hosts <list|all>          [required] The target host names
  -u, --user <dopamine|root|all>  Check the keys of these users

Additional Options:
  -p, --parallel [limit]          When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
  -v, --verbose                   Turn ON log details of whats happening
  -f, --force                     Suppress confirm messages (used for automation)
  --dry-run                       Dry run mode will do everything as usual except commands execution
  --quiet                         Turn off chat and some logs in stdout
  --wait <int>                    Pause between iterations in seconds
  --announce                      Announce what and why is happening and delay the execution to give time to all to prepare
  --no-chat                       Disable chat notification if they are activated
  -h, --help                      output usage information
```
### <a name="ssh-keys-remove"></a>remove
Safely REMOVE ssh public key to multiple hosts
```
Usage: node servers/ssh-keys/remove --hosts <list|all> --user <dopamine|root> 

Safely REMOVE ssh public key to multiple hosts

Options:
  -h, --hosts <list|all>      [required] The target host names
  -u, --user <dopamine|root>  [required] The key will be removed for this user

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
