## Available programs:

* **[cdn](#cdn)**
    * **[check](#cdn-check)** - test suit of games cdn
    * **[update](#cdn-update)** - update games cdn
    * **[version](#cdn-version)** - checking current release version of games cdn
* **[cloudflare](#cloudflare)**
    * **[check](#cloudflare-check)** - check current cloudflare configuration
    * **[get](#cloudflare-get)** - get specific cloudflare configuration from all zones
    * **[unify-page-rules](#cloudflare-unify-page-rules)** - unifying cloudflare page rules
    * **[unify-pages](#cloudflare-unify-pages)** - unifying cloudflare custom pages
    * **[unify-settings](#cloudflare-unify-settings)** - unifying cloudflare custom settings
* **[docs](#docs)**
    * **[generate](#docs-generate)** - auto-generate README files with commands help
* **[hermes](#hermes)**
    * **[allow-panel-access](#hermes-allow-panel-access)** - allow QA access to gpanel
    * **[check](#hermes-check)** - pre-deployment tests
    * **[update](#hermes-update)** - direct update of hermes release version
    * **[version](#hermes-version)** - check current hermes release versions
* **[hermes-env](#hermes-env)**
    * **[check](#hermes-env-check)** 
    * **[create](#hermes-env-create)** 
    * **[destroy](#hermes-env-destroy)** 
    * **[prepare](#hermes-env-prepare)** 
* **[php-binary](#php-binary)**
    * **[check](#php-binary-check)** 
    * **[init](#php-binary-init)** 
* **[servers-conf](#servers-conf)**
    * **[list-changes](#servers-conf-list-changes)** 
    * **[update](#servers-conf-update)** - auto update sever configurations by reloading one by one each server
* **[sys-metrics](#sys-metrics)**
    * **[check](#sys-metrics-check)** 
    * **[init](#sys-metrics-init)** - installing sys-metrics
    * **[restart](#sys-metrics-restart)** 
    * **[stop](#sys-metrics-stop)** 
    * **[update](#sys-metrics-update)** - updating sys-metrics version
* **[vm-setup](#vm-setup)**
    * **[known-hosts](#vm-setup-known-hosts)** 

## Help
## <a name="cdn"></a>cdn
### <a name="cdn-check"></a>check
Test suit of games cdn
```
  Usage: node bin/cdn/check --hosts <list|all> --mode <blue|green> 

  Test suit of games cdn

  Options:
    -h, --hosts <list|all>   [required] Comma-separated list of cdn regions. Available: dev-hermes-lb,cdn-asia,cdn-europe,cdn-backup Available: dev-hermes-lb,cdn-asia,cdn-europe,cdn-backup
    -r, --revision <string>  Target revision (like r.3.9.9.0)
    -m, --mode <blue|green>  [required] Which cdn to by updated Available: blue,green

  Additional Options:
    -p, --parallel [limit]   When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose            Turn ON log details of whats happening
    -f, --force              Suppress confirm messages (used for automation)
    -n, --dry-run            Dry run mode will do everything as usual except commands execution
    -q, --quiet              Turn off chat and some logs in stdout
    -h, --help               output usage information
```
### <a name="cdn-update"></a>update
Update games cdn
```
  Usage: node bin/cdn/update --hosts <list|all> --mode <blue|green> 

  Update games cdn

  Options:
    -h, --hosts <list|all>   [required] Comma-separated list of cdn regions. Available: dev-hermes-lb,cdn-asia,cdn-europe,cdn-backup Available: dev-hermes-lb,cdn-asia,cdn-europe,cdn-backup
    -r, --revision <string>  Target revision (like r.3.9.9.0)
    -m, --mode <blue|green>  [required] Which cdn to by updated Available: blue,green

  Additional Options:
    -p, --parallel [limit]   When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose            Turn ON log details of whats happening
    -f, --force              Suppress confirm messages (used for automation)
    -n, --dry-run            Dry run mode will do everything as usual except commands execution
    -q, --quiet              Turn off chat and some logs in stdout
    -h, --help               output usage information
```
### <a name="cdn-version"></a>version
Checking current release version of games cdn
```
  Usage: node bin/cdn/version --hosts <list|all> 

  Checking current release version of games cdn

  Options:
    -h, --hosts <list|all>   [required] Comma-separated list of cdn regions. Available: dev-hermes-lb,cdn-asia,cdn-europe,cdn-backup Available: dev-hermes-lb,cdn-asia,cdn-europe,cdn-backup
    -m, --mode <blue|green>  Which cdn to by checked. By default will check both Available: blue,green

  Additional Options:
    -p, --parallel [limit]   When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose            Turn ON log details of whats happening
    -f, --force              Suppress confirm messages (used for automation)
    -n, --dry-run            Dry run mode will do everything as usual except commands execution
    -q, --quiet              Turn off chat and some logs in stdout
    -h, --help               output usage information
```
## <a name="cloudflare"></a>cloudflare
### <a name="cloudflare-check"></a>check
Check current cloudflare configuration
```
  Usage: node bin/cloudflare/check --zones <list|all> 

  Check current cloudflare configuration

  Options:
    -z, --zones <list|all>  [required] Comma-separated list of cloudflare zone aliases. Available: dopamine-gaming.com,rtggib.cash,tgp.cash,redtiger.cash,m-gservices.com,redtiger-demo.com Available: dopamine-gaming.com,rtggib.cash,tgp.cash,redtiger.cash,m-gservices.com,redtiger-demo.com

  Additional Options:
    -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose           Turn ON log details of whats happening
    -f, --force             Suppress confirm messages (used for automation)
    -n, --dry-run           Dry run mode will do everything as usual except commands execution
    -q, --quiet             Turn off chat and some logs in stdout
    -h, --help              output usage information
```
### <a name="cloudflare-get"></a>get
Get specific cloudflare configuration from all zones
```
  Usage: node bin/cloudflare/get --zones <list|all> 

  Get specific cloudflare configuration from all zones

  Options:
    -z, --zones <list|all>  [required] Comma-separated list of cloudflare zone aliases. Available: dopamine-gaming.com,rtggib.cash,tgp.cash,redtiger.cash,m-gservices.com,redtiger-demo.com Available: dopamine-gaming.com,rtggib.cash,tgp.cash,redtiger.cash,m-gservices.com,redtiger-demo.com
    -u, --url <string>      Cloudflare url without the zone part (default: settings/security_level)

  Additional Options:
    -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose           Turn ON log details of whats happening
    -f, --force             Suppress confirm messages (used for automation)
    -n, --dry-run           Dry run mode will do everything as usual except commands execution
    -q, --quiet             Turn off chat and some logs in stdout
    -h, --help              output usage information
```
### <a name="cloudflare-unify-page-rules"></a>unify-page-rules
Unifying cloudflare page rules
```
  Usage: node bin/cloudflare/unify-page-rules --zones <list|all> 

  Unifying cloudflare page rules

  Options:
    -z, --zones <list|all>  [required] Comma-separated list of cloudflare zone aliases. Available: dopamine-gaming.com,rtggib.cash,tgp.cash,redtiger.cash,m-gservices.com,redtiger-demo.com Available: dopamine-gaming.com,rtggib.cash,tgp.cash,redtiger.cash,m-gservices.com,redtiger-demo.com

  Additional Options:
    -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose           Turn ON log details of whats happening
    -f, --force             Suppress confirm messages (used for automation)
    -n, --dry-run           Dry run mode will do everything as usual except commands execution
    -q, --quiet             Turn off chat and some logs in stdout
    -h, --help              output usage information
```
### <a name="cloudflare-unify-pages"></a>unify-pages
Unifying cloudflare custom pages
```
  Usage: node bin/cloudflare/unify-pages --zones <list|all> 

  Unifying cloudflare custom pages

  Options:
    -z, --zones <list|all>  [required] Comma-separated list of cloudflare zone aliases. Available: dopamine-gaming.com,rtggib.cash,tgp.cash,redtiger.cash,m-gservices.com,redtiger-demo.com Available: dopamine-gaming.com,rtggib.cash,tgp.cash,redtiger.cash,m-gservices.com,redtiger-demo.com

  Additional Options:
    -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose           Turn ON log details of whats happening
    -f, --force             Suppress confirm messages (used for automation)
    -n, --dry-run           Dry run mode will do everything as usual except commands execution
    -q, --quiet             Turn off chat and some logs in stdout
    -h, --help              output usage information
```
### <a name="cloudflare-unify-settings"></a>unify-settings
Unifying cloudflare custom settings
```
  Usage: node bin/cloudflare/unify-settings --zones <list|all> 

  Unifying cloudflare custom settings

  Options:
    -z, --zones <list|all>  [required] Comma-separated list of cloudflare zone aliases. Available: dopamine-gaming.com,rtggib.cash,tgp.cash,redtiger.cash,m-gservices.com,redtiger-demo.com Available: dopamine-gaming.com,rtggib.cash,tgp.cash,redtiger.cash,m-gservices.com,redtiger-demo.com

  Additional Options:
    -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose           Turn ON log details of whats happening
    -f, --force             Suppress confirm messages (used for automation)
    -n, --dry-run           Dry run mode will do everything as usual except commands execution
    -q, --quiet             Turn off chat and some logs in stdout
    -h, --help              output usage information
```
## <a name="docs"></a>docs
### <a name="docs-generate"></a>generate
Auto-generate README files with commands help
```
  Usage: node bin/docs/generate [options]

  Auto-generate README files with commands help

  Options:

  Additional Options:
    -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose           Turn ON log details of whats happening
    -f, --force             Suppress confirm messages (used for automation)
    -n, --dry-run           Dry run mode will do everything as usual except commands execution
    -q, --quiet             Turn off chat and some logs in stdout
    -h, --help              output usage information
```
## <a name="hermes"></a>hermes
### <a name="hermes-allow-panel-access"></a>allow-panel-access
Allow QA access to gpanel
```
  Usage: node bin/hermes/allow-panel-access --operators <list|all> 

  Allow QA access to gpanel

  Options:
    -o, --operators <list|all>  [required] Comma-separated list of operators. Available: rtg,bots,approv,betconstruct,bede,betfairmars,igc,kindred,matchbook,plaingaming,paddymars,rank,techsson,ugseu,videoslots,leovegas,mrgreen,sunbingo,pomadorro,pinnacle,marketing15,coingaming,williamhill,gvc,pop,gamesys,nektan,138global,aggfun,ugs2,ugs4,ugs3,ugs1,pokerstars Available: rtg,bots,approv,betconstruct,bede,betfairmars,igc,kindred,matchbook,plaingaming,paddymars,rank,techsson,ugseu,videoslots,leovegas,mrgreen,sunbingo,pomadorro,pinnacle,marketing15,coingaming,williamhill,gvc,pop,gamesys,nektan,138global,aggfun,ugs2,ugs4,ugs3,ugs1,pokerstars
    -m, --minutes <int>         Expire after defined minutes (default: 15)
    -r, --role <string>         Define admin role Available: RT_QAPROD,EXT_Marketing (default: RT_QAPROD)

  Additional Options:
    -p, --parallel [limit]      When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose               Turn ON log details of whats happening
    -f, --force                 Suppress confirm messages (used for automation)
    -n, --dry-run               Dry run mode will do everything as usual except commands execution
    -q, --quiet                 Turn off chat and some logs in stdout
    -h, --help                  output usage information
```
### <a name="hermes-check"></a>check
Pre-deployment tests
```
  Usage: node bin/hermes/check --operators <list|all> 

  Pre-deployment tests

  Options:
    -o, --operators <list|all>  [required] Comma-separated list of operators. Available: rtg,bots,approv,betconstruct,bede,betfairmars,igc,kindred,matchbook,plaingaming,paddymars,rank,techsson,ugseu,videoslots,leovegas,mrgreen,sunbingo,pomadorro,pinnacle,marketing15,coingaming,williamhill,gvc,pop,gamesys,nektan,138global,aggfun,ugs2,ugs4,ugs3,ugs1,pokerstars Available: rtg,bots,approv,betconstruct,bede,betfairmars,igc,kindred,matchbook,plaingaming,paddymars,rank,techsson,ugseu,videoslots,leovegas,mrgreen,sunbingo,pomadorro,pinnacle,marketing15,coingaming,williamhill,gvc,pop,gamesys,nektan,138global,aggfun,ugs2,ugs4,ugs3,ugs1,pokerstars
    -r, --revision <string>     Target revision (like r.3.9.9.01) or from..to revision (like r3.9.9.0..r3.9.9.1)

  Additional Options:
    -p, --parallel [limit]      When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose               Turn ON log details of whats happening
    -f, --force                 Suppress confirm messages (used for automation)
    -n, --dry-run               Dry run mode will do everything as usual except commands execution
    -q, --quiet                 Turn off chat and some logs in stdout
    -h, --help                  output usage information

  Example usage:
    node bin/hermes/check --operators all -p 10
    node bin/hermes/check -o bots,rtg
    node bin/hermes/check -o bots -r r3.9.9.1
    node bin/hermes/check -o bots -r r3.9.9.0..r3.9.9.1
```
### <a name="hermes-update"></a>update
Direct update of hermes release version
```
  Usage: node bin/hermes/update --operators <list|all> --revision <string> 

  Direct update of hermes release version

  Options:
    -o, --operators <list|all>  [required] Comma-separated list of operators. Available: rtg,bots,approv,betconstruct,bede,betfairmars,igc,kindred,matchbook,plaingaming,paddymars,rank,techsson,ugseu,videoslots,leovegas,mrgreen,sunbingo,pomadorro,pinnacle,marketing15,coingaming,williamhill,gvc,pop,gamesys,nektan,138global,aggfun,ugs2,ugs4,ugs3,ugs1,pokerstars Available: rtg,bots,approv,betconstruct,bede,betfairmars,igc,kindred,matchbook,plaingaming,paddymars,rank,techsson,ugseu,videoslots,leovegas,mrgreen,sunbingo,pomadorro,pinnacle,marketing15,coingaming,williamhill,gvc,pop,gamesys,nektan,138global,aggfun,ugs2,ugs4,ugs3,ugs1,pokerstars
    -r, --revision <string>     [required] Target revision (like r.3.9.9.0) or from..to revision (like r3.9.9.0..r3.9.9.1)
    -a, --allow-panel           Allow QA access to GPanel

  Additional Options:
    -p, --parallel [limit]      When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose               Turn ON log details of whats happening
    -f, --force                 Suppress confirm messages (used for automation)
    -n, --dry-run               Dry run mode will do everything as usual except commands execution
    -q, --quiet                 Turn off chat and some logs in stdout
    -h, --help                  output usage information
```
### <a name="hermes-version"></a>version
Check current hermes release versions
```
  Usage: node bin/hermes/version --operators <list|all> 

  Check current hermes release versions

  Options:
    -o, --operators <list|all>  [required] Comma-separated list of operators. Available: rtg,bots,approv,betconstruct,bede,betfairmars,igc,kindred,matchbook,plaingaming,paddymars,rank,techsson,ugseu,videoslots,leovegas,mrgreen,sunbingo,pomadorro,pinnacle,marketing15,coingaming,williamhill,gvc,pop,gamesys,nektan,138global,aggfun,ugs2,ugs4,ugs3,ugs1,pokerstars Available: rtg,bots,approv,betconstruct,bede,betfairmars,igc,kindred,matchbook,plaingaming,paddymars,rank,techsson,ugseu,videoslots,leovegas,mrgreen,sunbingo,pomadorro,pinnacle,marketing15,coingaming,williamhill,gvc,pop,gamesys,nektan,138global,aggfun,ugs2,ugs4,ugs3,ugs1,pokerstars

  Additional Options:
    -p, --parallel [limit]      When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose               Turn ON log details of whats happening
    -f, --force                 Suppress confirm messages (used for automation)
    -n, --dry-run               Dry run mode will do everything as usual except commands execution
    -q, --quiet                 Turn off chat and some logs in stdout
    -h, --help                  output usage information
```
## <a name="hermes-env"></a>hermes-env
### <a name="hermes-env-check"></a>check

```
  Usage: node bin/hermes-env/check --env <name> --location <name> 

  Options:
    -e, --env <name>        [required] The target env name
    -l, --location <name>   [required] The target location

  Additional Options:
    -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose           Turn ON log details of whats happening
    -f, --force             Suppress confirm messages (used for automation)
    -n, --dry-run           Dry run mode will do everything as usual except commands execution
    -q, --quiet             Turn off chat and some logs in stdout
    -h, --help              output usage information
```
### <a name="hermes-env-create"></a>create

```
  Usage: node bin/hermes-env/create --env <name> --location <name> 

  Options:
    -e, --env <name>        [required] The target env name
    -l, --location <name>   [required] The target location

  Additional Options:
    -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose           Turn ON log details of whats happening
    -f, --force             Suppress confirm messages (used for automation)
    -n, --dry-run           Dry run mode will do everything as usual except commands execution
    -q, --quiet             Turn off chat and some logs in stdout
    -h, --help              output usage information
```
### <a name="hermes-env-destroy"></a>destroy

```
  Usage: node bin/hermes-env/destroy --env <name> --location <name> 

  Options:
    -e, --env <name>        [required] The target env name
    -l, --location <name>   [required] The target location

  Additional Options:
    -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose           Turn ON log details of whats happening
    -f, --force             Suppress confirm messages (used for automation)
    -n, --dry-run           Dry run mode will do everything as usual except commands execution
    -q, --quiet             Turn off chat and some logs in stdout
    -h, --help              output usage information
```
### <a name="hermes-env-prepare"></a>prepare

```
  Usage: node bin/hermes-env/prepare --env <name> --location <name> 

  Options:
    -e, --env <name>        [required] The target env name
    -l, --location <name>   [required] The target location

  Additional Options:
    -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose           Turn ON log details of whats happening
    -f, --force             Suppress confirm messages (used for automation)
    -n, --dry-run           Dry run mode will do everything as usual except commands execution
    -q, --quiet             Turn off chat and some logs in stdout
    -h, --help              output usage information
```
## <a name="php-binary"></a>php-binary
### <a name="php-binary-check"></a>check

```
  Usage: node bin/php-binary/check --hosts <list|all> 

  Options:
    -h, --hosts <list|all>  [required] The target host name Available: dev-hermes-web1,dev-hermes-web2,belgium-web1,belgium-web2,manila-web1,manila-web2,manila-web3,manila-web4,manila-web5,iom-web1,iom-web2,iom-web3,iom-web4,iom-web5,tw-web1,tw-web2,tw-web3,tw-web4,tw-web5,gib-web1,gib-web2,gib-web3,gib-web4,gib-web5,pokerstars-web1,pokerstars-web2,pokerstars-web3,pokerstars-web4,pokerstars-web5

  Additional Options:
    -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose           Turn ON log details of whats happening
    -f, --force             Suppress confirm messages (used for automation)
    -n, --dry-run           Dry run mode will do everything as usual except commands execution
    -q, --quiet             Turn off chat and some logs in stdout
    -h, --help              output usage information
```
### <a name="php-binary-init"></a>init

```
  Usage: node bin/php-binary/init --hosts <list|all> --phpversion <version> 

  Options:
    -h, --hosts <list|all>      [required] The target host name Available: dev-hermes-web1,dev-hermes-web2,belgium-web1,belgium-web2,manila-web1,manila-web2,manila-web3,manila-web4,manila-web5,iom-web1,iom-web2,iom-web3,iom-web4,iom-web5,tw-web1,tw-web2,tw-web3,tw-web4,tw-web5,gib-web1,gib-web2,gib-web3,gib-web4,gib-web5,pokerstars-web1,pokerstars-web2,pokerstars-web3,pokerstars-web4,pokerstars-web5
    -p, --phpversion <version>  [required] The php version number Available: 7.1.19,7.1.20,7.2.6 (default: 7.1.20)

  Additional Options:
    -p, --parallel [limit]      When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose               Turn ON log details of whats happening
    -f, --force                 Suppress confirm messages (used for automation)
    -n, --dry-run               Dry run mode will do everything as usual except commands execution
    -q, --quiet                 Turn off chat and some logs in stdout
    -h, --help                  output usage information
```
## <a name="servers-conf"></a>servers-conf
### <a name="servers-conf-list-changes"></a>list-changes

```
  Usage: node bin/servers-conf/list-changes --locations <list|all> 

  Options:
    -l, --locations <list|all>  [required] The target host name Available: dev,gib,manila,taiwan,pokerstars,iom,belgium

  Additional Options:
    -p, --parallel [limit]      When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose               Turn ON log details of whats happening
    -f, --force                 Suppress confirm messages (used for automation)
    -n, --dry-run               Dry run mode will do everything as usual except commands execution
    -q, --quiet                 Turn off chat and some logs in stdout
    -h, --help                  output usage information
```
### <a name="servers-conf-update"></a>update
Auto update sever configurations by reloading one by one each server
```
  Usage: node bin/servers-conf/update --locations <list|all> 

  Auto update sever configurations by reloading one by one each server

  Options:
    -l, --locations <list|all>  [required] The target host name Available: dev,gib,manila,taiwan,pokerstars,iom,belgium
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
    -h, --help                  output usage information
```
## <a name="sys-metrics"></a>sys-metrics
### <a name="sys-metrics-check"></a>check

```
  Usage: node bin/sys-metrics/check --hosts <list|all> 

  Options:
    -h, --hosts <list|all>  [required] The target host names Available: git,sofia-mysql-backup-pokerstars,sofia-mysql-backup-manila,sofia-mysql-backup-iom,sofia-mysql-backup-manial-taiwan,sofia-mysql-mirror-pokerstars,sofia-mysql-mirror-manila-taiwan,sofia-mysql-mirror-manila,sofia-mysql-mirror-iom,sofia-mysql-mirror-gib,sofia-mysql-backup-pokerstars-archive,sofia-mysql-backup-manila-archive,sofia-mysql-backup-iom-archive,sofia-mysql-backup-gib-archive,sofia-mysql-backup-gib,sofia-logserver,sofia-syslog,dev-hermes-lb,dev-hermes-sql,dev-hermes-web1,dev-hermes-web2,france-srv1,cdn-europe,cdn-asia,cdn-backup,pokerstars-web1,pokerstars-web2,pokerstars-web3,pokerstars-web4,pokerstars-web5,pokerstars-lb1,pokerstars-lb2,pokerstars-system,pokerstars-sql1,pokerstars-sql2,pokerstars-sql3,pokerstars-mysql-archive,iom-lb,iom-mysql-new,iom-mysql-archive,iom-slave,iom-web1,iom-web2,iom-web3,iom-web4,iom-web5,iom-system,iom-3thparty-web1,iom-3thparty-web2,gib-lb1,gib-web1,gib-web2,gib-web3,gib-web4,gib-web5,gib-mysql,gib-mysql-slave,gib-mysql-archive,manila-lb,manila-mysql,manila-mysql-archive,manila-slave,manila-system,manila-web1,manila-web2,manila-web3,manila-web4,manila-web5,manila-tw-mysql,manila-tw-mysql-archive,tw-lb,tw-mysql,tw-mysql-archive,tw-mysql-slave,tw-web1,tw-web2,tw-web3,tw-web4,tw-web5,belgium-lb,belgium-mysql,belgium-web1,belgium-web2,data-warehouse

  Additional Options:
    -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose           Turn ON log details of whats happening
    -f, --force             Suppress confirm messages (used for automation)
    -n, --dry-run           Dry run mode will do everything as usual except commands execution
    -q, --quiet             Turn off chat and some logs in stdout
    -h, --help              output usage information
```
### <a name="sys-metrics-init"></a>init
Installing sys-metrics
```
  Usage: node bin/sys-metrics/init --hosts <list> 

  Installing sys-metrics

  Options:
    -h, --hosts <list>      [required] The target host names

  Additional Options:
    -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose           Turn ON log details of whats happening
    -f, --force             Suppress confirm messages (used for automation)
    -n, --dry-run           Dry run mode will do everything as usual except commands execution
    -q, --quiet             Turn off chat and some logs in stdout
    -h, --help              output usage information
```
### <a name="sys-metrics-restart"></a>restart

```
  Usage: node bin/sys-metrics/restart --hosts <list|all> 

  Options:
    -h, --hosts <list|all>  [required] The target host names Available: git,sofia-mysql-backup-pokerstars,sofia-mysql-backup-manila,sofia-mysql-backup-iom,sofia-mysql-backup-manial-taiwan,sofia-mysql-mirror-pokerstars,sofia-mysql-mirror-manila-taiwan,sofia-mysql-mirror-manila,sofia-mysql-mirror-iom,sofia-mysql-mirror-gib,sofia-mysql-backup-pokerstars-archive,sofia-mysql-backup-manila-archive,sofia-mysql-backup-iom-archive,sofia-mysql-backup-gib-archive,sofia-mysql-backup-gib,sofia-logserver,sofia-syslog,dev-hermes-lb,dev-hermes-sql,dev-hermes-web1,dev-hermes-web2,france-srv1,cdn-europe,cdn-asia,cdn-backup,pokerstars-web1,pokerstars-web2,pokerstars-web3,pokerstars-web4,pokerstars-web5,pokerstars-lb1,pokerstars-lb2,pokerstars-system,pokerstars-sql1,pokerstars-sql2,pokerstars-sql3,pokerstars-mysql-archive,iom-lb,iom-mysql-new,iom-mysql-archive,iom-slave,iom-web1,iom-web2,iom-web3,iom-web4,iom-web5,iom-system,iom-3thparty-web1,iom-3thparty-web2,gib-lb1,gib-web1,gib-web2,gib-web3,gib-web4,gib-web5,gib-mysql,gib-mysql-slave,gib-mysql-archive,manila-lb,manila-mysql,manila-mysql-archive,manila-slave,manila-system,manila-web1,manila-web2,manila-web3,manila-web4,manila-web5,manila-tw-mysql,manila-tw-mysql-archive,tw-lb,tw-mysql,tw-mysql-archive,tw-mysql-slave,tw-web1,tw-web2,tw-web3,tw-web4,tw-web5,belgium-lb,belgium-mysql,belgium-web1,belgium-web2,data-warehouse

  Additional Options:
    -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose           Turn ON log details of whats happening
    -f, --force             Suppress confirm messages (used for automation)
    -n, --dry-run           Dry run mode will do everything as usual except commands execution
    -q, --quiet             Turn off chat and some logs in stdout
    -h, --help              output usage information
```
### <a name="sys-metrics-stop"></a>stop

```
  Usage: node bin/sys-metrics/stop --hosts <list|all> 

  Options:
    -h, --hosts <list|all>  [required] The target host names Available: git,sofia-mysql-backup-pokerstars,sofia-mysql-backup-manila,sofia-mysql-backup-iom,sofia-mysql-backup-manial-taiwan,sofia-mysql-mirror-pokerstars,sofia-mysql-mirror-manila-taiwan,sofia-mysql-mirror-manila,sofia-mysql-mirror-iom,sofia-mysql-mirror-gib,sofia-mysql-backup-pokerstars-archive,sofia-mysql-backup-manila-archive,sofia-mysql-backup-iom-archive,sofia-mysql-backup-gib-archive,sofia-mysql-backup-gib,sofia-logserver,sofia-syslog,dev-hermes-lb,dev-hermes-sql,dev-hermes-web1,dev-hermes-web2,france-srv1,cdn-europe,cdn-asia,cdn-backup,pokerstars-web1,pokerstars-web2,pokerstars-web3,pokerstars-web4,pokerstars-web5,pokerstars-lb1,pokerstars-lb2,pokerstars-system,pokerstars-sql1,pokerstars-sql2,pokerstars-sql3,pokerstars-mysql-archive,iom-lb,iom-mysql-new,iom-mysql-archive,iom-slave,iom-web1,iom-web2,iom-web3,iom-web4,iom-web5,iom-system,iom-3thparty-web1,iom-3thparty-web2,gib-lb1,gib-web1,gib-web2,gib-web3,gib-web4,gib-web5,gib-mysql,gib-mysql-slave,gib-mysql-archive,manila-lb,manila-mysql,manila-mysql-archive,manila-slave,manila-system,manila-web1,manila-web2,manila-web3,manila-web4,manila-web5,manila-tw-mysql,manila-tw-mysql-archive,tw-lb,tw-mysql,tw-mysql-archive,tw-mysql-slave,tw-web1,tw-web2,tw-web3,tw-web4,tw-web5,belgium-lb,belgium-mysql,belgium-web1,belgium-web2,data-warehouse

  Additional Options:
    -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose           Turn ON log details of whats happening
    -f, --force             Suppress confirm messages (used for automation)
    -n, --dry-run           Dry run mode will do everything as usual except commands execution
    -q, --quiet             Turn off chat and some logs in stdout
    -h, --help              output usage information
```
### <a name="sys-metrics-update"></a>update
Updating sys-metrics version
```
  Usage: node bin/sys-metrics/update --hosts <list|all> --revision <tag> 

  Updating sys-metrics version

  Options:
    -h, --hosts <list|all>  [required] The target host names Available: git,sofia-mysql-backup-pokerstars,sofia-mysql-backup-manila,sofia-mysql-backup-iom,sofia-mysql-backup-manial-taiwan,sofia-mysql-mirror-pokerstars,sofia-mysql-mirror-manila-taiwan,sofia-mysql-mirror-manila,sofia-mysql-mirror-iom,sofia-mysql-mirror-gib,sofia-mysql-backup-pokerstars-archive,sofia-mysql-backup-manila-archive,sofia-mysql-backup-iom-archive,sofia-mysql-backup-gib-archive,sofia-mysql-backup-gib,sofia-logserver,sofia-syslog,dev-hermes-lb,dev-hermes-sql,dev-hermes-web1,dev-hermes-web2,france-srv1,cdn-europe,cdn-asia,cdn-backup,pokerstars-web1,pokerstars-web2,pokerstars-web3,pokerstars-web4,pokerstars-web5,pokerstars-lb1,pokerstars-lb2,pokerstars-system,pokerstars-sql1,pokerstars-sql2,pokerstars-sql3,pokerstars-mysql-archive,iom-lb,iom-mysql-new,iom-mysql-archive,iom-slave,iom-web1,iom-web2,iom-web3,iom-web4,iom-web5,iom-system,iom-3thparty-web1,iom-3thparty-web2,gib-lb1,gib-web1,gib-web2,gib-web3,gib-web4,gib-web5,gib-mysql,gib-mysql-slave,gib-mysql-archive,manila-lb,manila-mysql,manila-mysql-archive,manila-slave,manila-system,manila-web1,manila-web2,manila-web3,manila-web4,manila-web5,manila-tw-mysql,manila-tw-mysql-archive,tw-lb,tw-mysql,tw-mysql-archive,tw-mysql-slave,tw-web1,tw-web2,tw-web3,tw-web4,tw-web5,belgium-lb,belgium-mysql,belgium-web1,belgium-web2,data-warehouse
    -r, --revision <tag>    [required] The target version as tag name

  Additional Options:
    -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose           Turn ON log details of whats happening
    -f, --force             Suppress confirm messages (used for automation)
    -n, --dry-run           Dry run mode will do everything as usual except commands execution
    -q, --quiet             Turn off chat and some logs in stdout
    -h, --help              output usage information
```
## <a name="vm-setup"></a>vm-setup
### <a name="vm-setup-known-hosts"></a>known-hosts

```
  Usage: node bin/vm-setup/known-hosts --hosts <list|all> 

  Options:
    -h, --hosts <list|all>  [required] The target host names Available: belgium-lb,belgium-mysql-master,belgium-web1,belgium-web2,cdn-asia,cdn-backup,cdn-europe,data-warehouse,dev-hermes-lb,dev-hermes-sql,dev-hermes-web1,dev-hermes-web2,france-srv1,gib-lb,gib-mysql,gib-mysql-archive,gib-mysql-slave,gib-srv1,gib-srv2,gib-srv3,gib-web1,gib-web2,gib-web3,gib-web4,gib-web5,iom-java1,iom-java2,iom-lb,iom-mysql,iom-mysql-archive,iom-mysql-slave,iom-srv1,iom-srv2,iom-srv3,iom-srv4,iom-system,iom-web1,iom-web2,iom-web3,iom-web4,iom-web5,malta-srv1,manila-lb,manila-mysql,manila-mysql-archive,manila-mysql-slave,manila-mysql-staging,manila-srv1,manila-srv2,manila-srv3,manila-system,manila-web1,manila-web2,manila-web3,manila-web4,manila-web5,monitoring,pokerstars-lb,pokerstars-lb-staging,pokerstars-mysql,pokerstars-mysql-archive,pokerstars-mysql-slave,pokerstars-mysql-staging,pokerstars-system,pokerstars-web1,pokerstars-web2,pokerstars-web3,pokerstars-web4,pokerstars-web5,sofia-central-sql,sofia-mysql-backup-gib,sofia-mysql-backup-gib-archive,sofia-mysql-backup-iom,sofia-mysql-backup-iom-archive,sofia-mysql-backup-manila,sofia-mysql-backup-manila-archive,sofia-mysql-backup-pokerstars,sofia-mysql-backup-pokerstars-archive,sofia-mysql-backup-tw,sofia-mysql-backup-tw-archive,sofia-mysql-mirror-belgium,sofia-mysql-mirror-gib,sofia-mysql-mirror-gib-new,sofia-mysql-mirror-iom,sofia-mysql-mirror-iom-new,sofia-mysql-mirror-manila,sofia-mysql-mirror-manila-new,sofia-mysql-mirror-pokerstars,sofia-mysql-mirror-pokerstars-new,sofia-mysql-mirror-tw,sofia-mysql-mirror-tw-new,tw-lb,tw-mysql,tw-mysql-archive,tw-mysql-slave,tw-mysql-slave2,tw-web1,tw-web2,tw-web3,tw-web4,tw-web5

  Additional Options:
    -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose           Turn ON log details of whats happening
    -f, --force             Suppress confirm messages (used for automation)
    -n, --dry-run           Dry run mode will do everything as usual except commands execution
    -q, --quiet             Turn off chat and some logs in stdout
    -h, --help              output usage information
```
