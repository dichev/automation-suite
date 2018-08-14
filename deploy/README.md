## Available programs:

* **[cdn](#cdn)**
    * **[cachebust](#cdn-cachebust)** - cachebusting html assets
    * **[check](#cdn-check)** - test suit of games cdn
    * **[update](#cdn-update)** - update games cdn
    * **[version](#cdn-version)** - checking current release version of games cdn
* **[crons](#crons)**
    * **[fetch](#crons-fetch)** - check crons for manual changes and diffs
    * **[update](#crons-update)** - update crons to match the seed repo
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
* **[monitoring](#monitoring)**
    * **[check](#monitoring-check)** - pre-deployment tests for Grafana-Sensors
    * **[fetch](#monitoring-fetch)** - add new operator configuration in Grafana-Sensors
    * **[update](#monitoring-update)** - update Grafana-Sensors repo
* **[sys-metrics](#sys-metrics)**
    * **[check](#sys-metrics-check)** 
    * **[init](#sys-metrics-init)** - installing sys-metrics
    * **[restart](#sys-metrics-restart)** 
    * **[stop](#sys-metrics-stop)** 
    * **[update](#sys-metrics-update)** - updating sys-metrics version

## Help
## <a name="cdn"></a>cdn
### <a name="cdn-cachebust"></a>cachebust
Cachebusting html assets
```
  Usage: node deploy/cdn/cachebust --hosts <list|all> 

  Cachebusting html assets

  Options:
    -h, --hosts <list|all>  [required] Comma-separated list of cdn regions. Available: dev-hermes-lb,cdn-asia,cdn-europe,cdn-backup

  Additional Options:
    -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose           Turn ON log details of whats happening
    -f, --force             Suppress confirm messages (used for automation)
    -n, --dry-run           Dry run mode will do everything as usual except commands execution
    -q, --quiet             Turn off chat and some logs in stdout
    --no-chat               Disable chat notification if they are activated
    -h, --help              output usage information
```
### <a name="cdn-check"></a>check
Test suit of games cdn
```
  Usage: node deploy/cdn/check --hosts <list|all> --mode <blue|green> 

  Test suit of games cdn

  Options:
    -h, --hosts <list|all>   [required] Comma-separated list of cdn regions. Available: dev-hermes-lb,cdn-asia,cdn-europe,cdn-backup
    -r, --revision <string>  Target revision (like r3.9.9.0)
    -m, --mode <blue|green>  [required] Which cdn to be updated. Available: blue,green

  Additional Options:
    -p, --parallel [limit]   When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose            Turn ON log details of whats happening
    -f, --force              Suppress confirm messages (used for automation)
    -n, --dry-run            Dry run mode will do everything as usual except commands execution
    -q, --quiet              Turn off chat and some logs in stdout
    --no-chat                Disable chat notification if they are activated
    -h, --help               output usage information
```
### <a name="cdn-update"></a>update
Update games cdn
```
  Usage: node deploy/cdn/update --hosts <list|all> --mode <blue|green> 

  Update games cdn

  Options:
    -h, --hosts <list|all>   [required] Comma-separated list of cdn regions. Available: dev-hermes-lb,cdn-asia,cdn-europe,cdn-backup
    -r, --revision <string>  Target revision (like r3.9.9.0)
    -m, --mode <blue|green>  [required] Which cdn to be updated. Available: blue,green

  Additional Options:
    -p, --parallel [limit]   When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose            Turn ON log details of whats happening
    -f, --force              Suppress confirm messages (used for automation)
    -n, --dry-run            Dry run mode will do everything as usual except commands execution
    -q, --quiet              Turn off chat and some logs in stdout
    --no-chat                Disable chat notification if they are activated
    -h, --help               output usage information
```
### <a name="cdn-version"></a>version
Checking current release version of games cdn
```
  Usage: node deploy/cdn/version --hosts <list|all> 

  Checking current release version of games cdn

  Options:
    -h, --hosts <list|all>   [required] Comma-separated list of cdn regions. Available: dev-hermes-lb,cdn-asia,cdn-europe,cdn-backup
    -m, --mode <blue|green>  Which cdn to by checked. By default will check both. Available: blue,green

  Additional Options:
    -p, --parallel [limit]   When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose            Turn ON log details of whats happening
    -f, --force              Suppress confirm messages (used for automation)
    -n, --dry-run            Dry run mode will do everything as usual except commands execution
    -q, --quiet              Turn off chat and some logs in stdout
    --no-chat                Disable chat notification if they are activated
    -h, --help               output usage information
```
## <a name="crons"></a>crons
### <a name="crons-fetch"></a>fetch
Check crons for manual changes and diffs
```
  Usage: node deploy/crons/fetch --locations <list|all> 

  Check crons for manual changes and diffs

  Options:
    -l, --locations <list|all>  [required] Comma-separated list of locations. Available: monitoring,gib,manila,taiwan,pokerstars,iom,belgium

  Additional Options:
    -p, --parallel [limit]      When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose               Turn ON log details of whats happening
    -f, --force                 Suppress confirm messages (used for automation)
    -n, --dry-run               Dry run mode will do everything as usual except commands execution
    -q, --quiet                 Turn off chat and some logs in stdout
    --no-chat                   Disable chat notification if they are activated
    -h, --help                  output usage information

  Example usage:
    node deploy/crons/fetch --locations all -p
```
### <a name="crons-update"></a>update
Update crons to match the seed repo
```
  Usage: node deploy/crons/update --locations <list|all> 

  Update crons to match the seed repo

  Options:
    -l, --locations <list|all>  [required] Comma-separated list of locations. Available: monitoring,gib,manila,taiwan,pokerstars,iom,belgium
    -r, --rev <string>          Target revision (like r3.9.9.0)

  Additional Options:
    -p, --parallel [limit]      When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose               Turn ON log details of whats happening
    -f, --force                 Suppress confirm messages (used for automation)
    -n, --dry-run               Dry run mode will do everything as usual except commands execution
    -q, --quiet                 Turn off chat and some logs in stdout
    --no-chat                   Disable chat notification if they are activated
    -h, --help                  output usage information

  Example usage:
    node deploy/crons/update --locations belgium
    node deploy/crons/update --locations belgium --rev r3.9.9.0
```
## <a name="hermes"></a>hermes
### <a name="hermes-allow-panel-access"></a>allow-panel-access
Allow QA access to gpanel
```
  Usage: node deploy/hermes/allow-panel-access --operators <list|all> 

  Allow QA access to gpanel

  Options:
    -o, --operators <list|all>  [required] Comma-separated list of operators. Available: rtg,bots,approv,betconstruct,bede,betfairmars,igc,kindred,matchbook,plaingaming,paddymars,rank,techsson,ugseu,videoslots,leovegas,mrgreen,sunbingo,pomadorro,pinnacle,marketing15,coingaming,soft2bet,williamhill,gvc,pop,gamesys,nektan,138global,pokerstars,aggfun,ugs2,ugs4,ugs3,ugs1
    -m, --minutes <int>         Expire after defined minutes (default: 15)
    -r, --role <string>         Define admin role. Available: RT_QAPROD,EXT_Marketing (default: RT_QAPROD)

  Additional Options:
    -p, --parallel [limit]      When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose               Turn ON log details of whats happening
    -f, --force                 Suppress confirm messages (used for automation)
    -n, --dry-run               Dry run mode will do everything as usual except commands execution
    -q, --quiet                 Turn off chat and some logs in stdout
    --no-chat                   Disable chat notification if they are activated
    -h, --help                  output usage information
```
### <a name="hermes-check"></a>check
Pre-deployment tests
```
  Usage: node deploy/hermes/check --operators <list|all> 

  Pre-deployment tests

  Options:
    -o, --operators <list|all>  [required] Comma-separated list of operators. Available: rtg,bots,approv,betconstruct,bede,betfairmars,igc,kindred,matchbook,plaingaming,paddymars,rank,techsson,ugseu,videoslots,leovegas,mrgreen,sunbingo,pomadorro,pinnacle,marketing15,coingaming,soft2bet,williamhill,gvc,pop,gamesys,nektan,138global,pokerstars,aggfun,ugs2,ugs4,ugs3,ugs1
    -r, --rev <string>          Target revision (like r3.9.9.01) or from..to revision (like r3.9.9.0..r3.9.9.1)

  Additional Options:
    -p, --parallel [limit]      When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose               Turn ON log details of whats happening
    -f, --force                 Suppress confirm messages (used for automation)
    -n, --dry-run               Dry run mode will do everything as usual except commands execution
    -q, --quiet                 Turn off chat and some logs in stdout
    --no-chat                   Disable chat notification if they are activated
    -h, --help                  output usage information

  Example usage:
    node deploy/hermes/check --operators all -p 10
    node deploy/hermes/check -o bots,rtg
    node deploy/hermes/check -o bots -r r3.9.9.1
    node deploy/hermes/check -o bots -r r3.9.9.0..r3.9.9.1
```
### <a name="hermes-update"></a>update
Direct update of hermes release version
```
  Usage: node deploy/hermes/update --operators <list|all> --rev <string> 

  Direct update of hermes release version

  Options:
    -o, --operators <list|all>          [required] Comma-separated list of operators. Available: rtg,bots,approv,betconstruct,bede,betfairmars,igc,kindred,matchbook,plaingaming,paddymars,rank,techsson,ugseu,videoslots,leovegas,mrgreen,sunbingo,pomadorro,pinnacle,marketing15,coingaming,soft2bet,williamhill,gvc,pop,gamesys,nektan,138global,pokerstars,aggfun,ugs2,ugs4,ugs3,ugs1
    -r, --rev <string>                  [required] Target revision (like r3.9.9.0) or from..to revision (like r3.9.9.0..r3.9.9.1)
    -s, --strategy <direct|blue-green>  Choose deployment strategy. Available: direct,blue-green (default: blue-green)
    --allow-panel                       Allow QA access to GPanel

  Additional Options:
    -p, --parallel [limit]              When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose                       Turn ON log details of whats happening
    -f, --force                         Suppress confirm messages (used for automation)
    -n, --dry-run                       Dry run mode will do everything as usual except commands execution
    -q, --quiet                         Turn off chat and some logs in stdout
    --no-chat                           Disable chat notification if they are activated
    -h, --help                          output usage information

  Example usage:
    node deploy/hermes/update --operators bots --rev r3.9.9.1 --strategy blue-green --allow-panel --force
```
### <a name="hermes-version"></a>version
Check current hermes release versions
```
  Usage: node deploy/hermes/version --operators <list|all> 

  Check current hermes release versions

  Options:
    -o, --operators <list|all>  [required] Comma-separated list of operators. Available: rtg,bots,approv,betconstruct,bede,betfairmars,igc,kindred,matchbook,plaingaming,paddymars,rank,techsson,ugseu,videoslots,leovegas,mrgreen,sunbingo,pomadorro,pinnacle,marketing15,coingaming,soft2bet,williamhill,gvc,pop,gamesys,nektan,138global,pokerstars,aggfun,ugs2,ugs4,ugs3,ugs1

  Additional Options:
    -p, --parallel [limit]      When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose               Turn ON log details of whats happening
    -f, --force                 Suppress confirm messages (used for automation)
    -n, --dry-run               Dry run mode will do everything as usual except commands execution
    -q, --quiet                 Turn off chat and some logs in stdout
    --no-chat                   Disable chat notification if they are activated
    -h, --help                  output usage information

  Example usage:
    $ node deploy/hermes/version --operators all -p 10
```
## <a name="hermes-env"></a>hermes-env
### <a name="hermes-env-check"></a>check

```
  Usage: node deploy/hermes-env/check --env <name> 

  Options:
    -e, --env <name>        [required] The target env name

  Additional Options:
    -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose           Turn ON log details of whats happening
    -f, --force             Suppress confirm messages (used for automation)
    -n, --dry-run           Dry run mode will do everything as usual except commands execution
    -q, --quiet             Turn off chat and some logs in stdout
    --no-chat               Disable chat notification if they are activated
    -h, --help              output usage information
```
### <a name="hermes-env-create"></a>create

```
  Usage: node deploy/hermes-env/create --env <name> 

  Options:
    -e, --env <name>        [required] The target env name

  Additional Options:
    -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose           Turn ON log details of whats happening
    -f, --force             Suppress confirm messages (used for automation)
    -n, --dry-run           Dry run mode will do everything as usual except commands execution
    -q, --quiet             Turn off chat and some logs in stdout
    --no-chat               Disable chat notification if they are activated
    -h, --help              output usage information
```
### <a name="hermes-env-destroy"></a>destroy

```
  Usage: node deploy/hermes-env/destroy --env <name> 

  Options:
    -e, --env <name>        [required] The target env name

  Additional Options:
    -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose           Turn ON log details of whats happening
    -f, --force             Suppress confirm messages (used for automation)
    -n, --dry-run           Dry run mode will do everything as usual except commands execution
    -q, --quiet             Turn off chat and some logs in stdout
    --no-chat               Disable chat notification if they are activated
    -h, --help              output usage information
```
### <a name="hermes-env-prepare"></a>prepare

```
  Usage: node deploy/hermes-env/prepare --env <name> --location <name> 

  Options:
    -e, --env <name>        [required] The target env name
    -l, --location <name>   [required] The target location

  Additional Options:
    -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose           Turn ON log details of whats happening
    -f, --force             Suppress confirm messages (used for automation)
    -n, --dry-run           Dry run mode will do everything as usual except commands execution
    -q, --quiet             Turn off chat and some logs in stdout
    --no-chat               Disable chat notification if they are activated
    -h, --help              output usage information
```
## <a name="monitoring"></a>monitoring
### <a name="monitoring-check"></a>check
Pre-deployment tests for Grafana-Sensors
```
  Usage: node deploy/monitoring/check [options]

  Pre-deployment tests for Grafana-Sensors

  Options:

  Additional Options:
    -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose           Turn ON log details of whats happening
    -f, --force             Suppress confirm messages (used for automation)
    -n, --dry-run           Dry run mode will do everything as usual except commands execution
    -q, --quiet             Turn off chat and some logs in stdout
    --no-chat               Disable chat notification if they are activated
    -h, --help              output usage information

  Example usage:
    node deploy/monitoring/check
```
### <a name="monitoring-fetch"></a>fetch
Add new operator configuration in Grafana-Sensors
```
  Usage: node deploy/monitoring/fetch --env <name> --location <name> 

  Add new operator configuration in Grafana-Sensors

  Options:
    -e, --env <name>        [required] The target env name
    -l, --location <name>   [required] The target location

  Additional Options:
    -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose           Turn ON log details of whats happening
    -f, --force             Suppress confirm messages (used for automation)
    -n, --dry-run           Dry run mode will do everything as usual except commands execution
    -q, --quiet             Turn off chat and some logs in stdout
    --no-chat               Disable chat notification if they are activated
    -h, --help              output usage information

  Example usage:
    node deploy/monitoring/fetch -l iom -e rank
```
### <a name="monitoring-update"></a>update
Update Grafana-Sensors repo
```
  Usage: node deploy/monitoring/update [options]

  Update Grafana-Sensors repo

  Options:

  Additional Options:
    -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose           Turn ON log details of whats happening
    -f, --force             Suppress confirm messages (used for automation)
    -n, --dry-run           Dry run mode will do everything as usual except commands execution
    -q, --quiet             Turn off chat and some logs in stdout
    --no-chat               Disable chat notification if they are activated
    -h, --help              output usage information

  Example usage:
    node deploy/monitoring/update
```
## <a name="sys-metrics"></a>sys-metrics
### <a name="sys-metrics-check"></a>check

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
### <a name="sys-metrics-init"></a>init
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
### <a name="sys-metrics-restart"></a>restart

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
### <a name="sys-metrics-stop"></a>stop

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
### <a name="sys-metrics-update"></a>update
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
