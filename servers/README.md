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
    * **[rsyslog](#vm-setup-rsyslog)** - setup logrotate configurations

## Help
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
    -u, --url <string>      Cloudflare url without the zone part (default: settings/security_level)

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
  Usage: node servers/php-binary/init --hosts <list|all> --phpversion <version> 

  Options:
    -h, --hosts <list|all>      [required] The target host name
    -p, --phpversion <version>  [required] The php version number

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
### <a name="servers-conf-list-changes"></a>list-changes

```
  Usage: node servers/servers-conf/list-changes --locations <list|all> 

  Options:
    -l, --locations <list|all>  [required] The target host name

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
    -l, --locations <list|all>                [required] The target host name
    -r, --rev <string>                        Specify target git revision, very useful for rollback. Default reset to origin/master
    -i, --interval <int>                      How many seconds to wait between each configuration switch. Default is 2
    -f, --force                               Skip manual changes validations and proceed on your risk
    --no-wait-webs                            Skip waiting for active php processes to end and other safety delays. WARNING: this will break current php processes in the middle of their execution causing strange errors.
    --reload <nginx|webs|nginx-with-upgrade>  Reload nginx service or webs php-fpm

  Additional Options:
    -p, --parallel [limit]                    When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose                             Turn ON log details of whats happening
    -f, --force                               Suppress confirm messages (used for automation)
    --dry-run                                 Dry run mode will do everything as usual except commands execution
    --quiet                                   Turn off chat and some logs in stdout
    --wait <int>                              Pause between iterations in seconds
    --announce                                Announce what and why is happening and delay the execution to give time to all to prepare
    --no-chat                                 Disable chat notification if they are activated
    -h, --help                                output usage information
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
