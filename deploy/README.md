## Available programs:

* **[aggregations](#aggregations)**
    * **[sync-segments-cleanup](#aggregations-sync-segments-cleanup)** - clean migration files and tables after sync segments
    * **[sync-segments](#aggregations-sync-segments)** - sync segments data to aggregated data
* **[anomaly](#anomaly)**
    * **[rebuild](#anomaly-rebuild)** - rebuild anomaly docker
* **[cayetano](#cayetano)**
    * **[check](#cayetano-check)** - check cayetano docker swarm
    * **[init](#cayetano-init)** - setup cayetano docker swarm
    * **[update](#cayetano-update)** - deploy cayetano docker swarm
* **[cdn](#cdn)**
    * **[cachebust](#cdn-cachebust)** - cachebust html assets
    * **[check](#cdn-check)** - test suit of games cdn
    * **[update](#cdn-update)** - update games cdn
    * **[version](#cdn-version)** - checking current release version of games cdn
* **[crons](#crons)**
    * **[execute](#crons-execute)** - execute cron for list of operators
    * **[fetch](#crons-fetch)** - check crons for manual changes and diffs
    * **[update](#crons-update)** - update crons to match the seed repo
* **[env](#env)**
    * **[check](#env-check)** 
    * **[create](#env-create)** 
    * **[destroy](#env-destroy)** 
    * **[prepare](#env-prepare)** 
* **[hermes](#hermes)**
    * **[activate-games](#hermes-activate-games)** - activate new games
    * **[allow-panel-access](#hermes-allow-panel-access)** - allow QA access to gpanel
    * **[check](#hermes-check)** - pre-deployment tests
    * **[jackpot](#hermes-jackpot)** - execute jackpot related migrations with spin locking
    * **[migration](#hermes-migration)** - auto execute SQL migrations to production
    * **[sync-betlimits](#hermes-sync-betlimits)** - sync operator bet limits without downtime
    * **[sync-games](#hermes-sync-games)** - sync games and maths seeds
    * **[update](#hermes-update)** - fast simultaneous deploy to all operators per location without down time
    * **[version](#hermes-version)** - check current hermes release versions
* **[monitoring](#monitoring)**
    * **[check](#monitoring-check)** - pre-deployment tests for Grafana-Sensors
    * **[update](#monitoring-update)** - update Grafana-Sensors docker
* **[prodmon](#prodmon)**
    * **[update](#prodmon-update)** - update Prod. Monitoring docker service
* **[safeguard](#safeguard)**
    * **[control](#safeguard-control)** 
    * **[setup](#safeguard-setup)** - installing safeguard
    * **[update-schema](#safeguard-update-schema)** - updating safeguard version
    * **[update](#safeguard-update)** - updating safeguard version
* **[ssl-framework](#ssl-framework)**
    * **[check](#ssl-framework-check)** - pre-deployment tests for SSL-Framework
    * **[update](#ssl-framework-update)** - update SSL-Framework
* **[sys-metrics](#sys-metrics)**
    * **[check](#sys-metrics-check)** 
    * **[init](#sys-metrics-init)** - installing sys-metrics
    * **[restart](#sys-metrics-restart)** 
    * **[stop](#sys-metrics-stop)** 
    * **[update](#sys-metrics-update)** - updating sys-metrics version

## Help
## <a name="aggregations"></a>aggregations
### <a name="aggregations-sync-segments-cleanup"></a>sync-segments-cleanup
Clean migration files and tables after sync segments
```
Usage: node deploy/aggregations/sync-segments-cleanup --operators <name> 

Clean migration files and tables after sync segments

Options:
  -o, --operators <name>  [required] The target operator name. Available: bots, 
                          dope, islandluck, approv, betconstruct, bede, igc, 
                          kindredgroup, matchbook, plaingaming, rank, techsson, 
                          playfortuna, videoslots, leovegas (.. 126 more)

Additional Options: (see global options)
```
### <a name="aggregations-sync-segments"></a>sync-segments
Sync segments data to aggregated data
```
WARNING! Do not forget to ensure the segments aggregate cron is disabled AND is currently stopped!
Usage: node deploy/aggregations/sync-segments --operators <name> --mode <only-transfer|only-migrate|both> 

Sync segments data to aggregated data

Options:
  -o, --operators <name>                    [required] The target operator name. Available: bots, dope, islandluck, approv, betconstruct, bede, igc, kindredgroup, matchbook, plaingaming, rank, techsson, playfortuna, videoslots, leovegas (.. 126 more)
  --mode <only-transfer|only-migrate|both>  [required] Specify witch part of the deploy to be executed. Available: only-transfer, only-migrate, both (default: "both")

Additional Options: (see global options)
```
## <a name="anomaly"></a>anomaly
### <a name="anomaly-rebuild"></a>rebuild
Rebuild anomaly docker
```
Usage: node deploy/anomaly/rebuild [options]

Rebuild anomaly docker

Options:

Additional Options: (see global options)
```
## <a name="cayetano"></a>cayetano
### <a name="cayetano-check"></a>check
Check cayetano docker swarm
```
Usage: node deploy/cayetano/check --locations <list|all> 

Check cayetano docker swarm

Options:
  -l, --locations <list|all>  [required] The target host name. Available: dev, 
                              belgium-sandbox, belgium-alderney, belgium-other, 
                              rockolo, taiwan, belgium-mga, bahamas

Additional Options: (see global options)
```
### <a name="cayetano-init"></a>init
Setup cayetano docker swarm
```
Usage: node deploy/cayetano/init --locations <list|all> 

Setup cayetano docker swarm

Options:
  -l, --locations <list|all>  [required] The target host name. Available: dev, 
                              belgium-sandbox, belgium-alderney, belgium-other, 
                              rockolo, taiwan, belgium-mga, bahamas

Additional Options: (see global options)
```
### <a name="cayetano-update"></a>update
Deploy cayetano docker swarm
```
Usage: node deploy/cayetano/update --locations <list|all> 

Deploy cayetano docker swarm

Options:
  -l, --locations <list|all>  [required] The target host name. Available: dev, 
                              belgium-sandbox, belgium-alderney, belgium-other, 
                              rockolo, taiwan, belgium-mga, bahamas
  -r, --rev <string>          Desired git revision/tag (useful for rollback) 
                              (default: "origin/master")

Additional Options: (see global options)
```
## <a name="cdn"></a>cdn
### <a name="cdn-cachebust"></a>cachebust
Cachebust html assets
```
Usage: node deploy/cdn/cachebust --operators <list|all> 

Cachebust html assets

Options:
  -o, --operators <list|all>  [required] Comma-separated list of operators. 
                              Available: bots, dope, islandluck, approv, 
                              betconstruct, bede, igc, kindredgroup, matchbook, 
                              plaingaming, rank, techsson, playfortuna, 
                              videoslots, leovegas (.. 126 more)

Additional Options: (see global options)
```
### <a name="cdn-check"></a>check
Test suit of games cdn
```
Usage: node deploy/cdn/check --hosts <list|all> --mode <blue|green> 

Test suit of games cdn

Options:
  -h, --hosts <list|all>   [required] Comma-separated list of cdn regions. 
                           Available: asia-cdn2, europe-cdn1, 
                           sofia-staging-cdn, sofia-dev-cdn
  -r, --revision <string>  Target revision (like r3.9.9.0)
  -m, --mode <blue|green>  [required] Which cdn to be updated. Available: blue, 
                           green

Additional Options: (see global options)
```
### <a name="cdn-update"></a>update
Update games cdn
```
Usage: node deploy/cdn/update --hosts <list|all> --mode <blue|green> 

Update games cdn

Options:
  -h, --hosts <list|all>   [required] Comma-separated list of cdn regions. 
                           Available: asia-cdn2, europe-cdn1, 
                           sofia-staging-cdn, sofia-dev-cdn
  -r, --revision <string>  Target revision (like r3.9.9.0)
  -m, --mode <blue|green>  [required] Which cdn to be updated. Available: blue, 
                           green

Additional Options: (see global options)
```
### <a name="cdn-version"></a>version
Checking current release version of games cdn
```
Usage: node deploy/cdn/version --hosts <list|all> 

Checking current release version of games cdn

Options:
  -h, --hosts <list|all>   [required] Comma-separated list of cdn regions. 
                           Available: asia-cdn2, europe-cdn1, 
                           sofia-staging-cdn, sofia-dev-cdn
  -m, --mode <blue|green>  Which cdn to by checked. By default will check both. 
                           Available: blue, green

Additional Options: (see global options)
```
## <a name="crons"></a>crons
### <a name="crons-execute"></a>execute
Execute cron for list of operators
```
Usage: node deploy/crons/execute --operators <list|all> --cron <string> --project <string> 

Execute cron for list of operators

Options:
  -o, --operators <list|all>  [required] Comma-separated list of operators. 
                              Available: bots, dope, islandluck, approv, 
                              betconstruct, bede, igc, kindredgroup, matchbook, 
                              plaingaming, rank, techsson, playfortuna, 
                              videoslots, leovegas (.. 126 more)
  -c, --cron <string>         [required] Cron name
  -p, --project <string>      [required] Project folder name

Additional Options: (see global options)
```
### <a name="crons-fetch"></a>fetch
Check crons for manual changes and diffs
```
Usage: node deploy/crons/fetch --locations <list|all> 

Check crons for manual changes and diffs

Options:
  -l, --locations <list|all>  [required] Comma-separated list of locations. 
                              Available: belgium-sandbox, belgium-alderney, 
                              belgium-other, rockolo, taiwan, belgium-mga, 
                              bahamas

Additional Options: (see global options)
```
### <a name="crons-update"></a>update
Update crons to match the seed repo
```
Usage: node deploy/crons/update --locations <list|all> 

Update crons to match the seed repo

Options:
  -l, --locations <list|all>  [required] Comma-separated list of locations. 
                              Available: belgium-sandbox, belgium-alderney, 
                              belgium-other, rockolo, taiwan, belgium-mga, 
                              bahamas
  -r, --rev <string>          Target revision (like r3.9.9.0)

Additional Options: (see global options)
```
## <a name="env"></a>env
### <a name="env-check"></a>check

```
Usage: node deploy/env/check --operators <name> 

Options:
  -o, --operators <name>  [required] The target operator name. Available: bots, 
                          dope, islandluck, approv, betconstruct, bede, igc, 
                          kindredgroup, matchbook, plaingaming, rank, techsson, 
                          playfortuna, videoslots, leovegas (.. 126 more)

Additional Options: (see global options)
```
### <a name="env-create"></a>create

```
Usage: node deploy/env/create --operator <name> 

Options:
  -o, --operator <name>   [required] The target operator name. Available: bots, 
                          dope, islandluck, approv, betconstruct, bede, igc, 
                          kindredgroup, matchbook, plaingaming, rank, techsson, 
                          playfortuna, videoslots, leovegas (.. 126 more)

Additional Options: (see global options)
```
### <a name="env-destroy"></a>destroy

```
Usage: node deploy/env/destroy --operator <name> 

Options:
  -o, --operator <name>   [required] The target operator name. Available: bots, 
                          dope, islandluck, approv, betconstruct, bede, igc, 
                          kindredgroup, matchbook, plaingaming, rank, techsson, 
                          playfortuna, videoslots, leovegas (.. 126 more)

Additional Options: (see global options)
```
### <a name="env-prepare"></a>prepare

```
Usage: node deploy/env/prepare --operator <name> 

Options:
  -o, --operator <name>   [required] The target operator name. Available: bots, 
                          dope, islandluck, approv, betconstruct, bede, igc, 
                          kindredgroup, matchbook, plaingaming, rank, techsson, 
                          playfortuna, videoslots, leovegas (.. 126 more)

Additional Options: (see global options)
```
## <a name="hermes"></a>hermes
### <a name="hermes-activate-games"></a>activate-games
Activate new games
```
Usage: node deploy/hermes/activate-games --operators <name> --week <week> 

Activate new games

Options:
  -o, --operators <name>  [required] The target operator name. Available: bots, 
                          dope, islandluck, approv, betconstruct, bede, igc, 
                          kindredgroup, matchbook, plaingaming, rank, techsson, 
                          playfortuna, videoslots, leovegas (.. 126 more)
  -w, --week <week>       [required] The target week
  --rollback              Will restore the previous state of games 
                          configurations. In case of production errors this is 
                          the fastest route

Additional Options: (see global options)
```
### <a name="hermes-allow-panel-access"></a>allow-panel-access
Allow QA access to gpanel
```
Usage: node deploy/hermes/allow-panel-access --operators <list|all> 

Allow QA access to gpanel

Options:
  -o, --operators <list|all>  [required] Comma-separated list of operators. 
                              Available: bots, dope, islandluck, approv, 
                              betconstruct, bede, igc, kindredgroup, matchbook, 
                              plaingaming, rank, techsson, playfortuna, 
                              videoslots, leovegas (.. 126 more)
  -m, --minutes <int>         Expire after defined minutes (default: 15)
  -r, --role <string>         Define admin role. Available: RT_QAPROD, 
                              EXT_Marketing (default: "RT_QAPROD")

Additional Options: (see global options)
```
### <a name="hermes-check"></a>check
Pre-deployment tests
```
Usage: node deploy/hermes/check --operators <list|all> 

Pre-deployment tests

Options:
  -o, --operators <list|all>  [required] Comma-separated list of operators. 
                              Available: bots, dope, islandluck, approv, 
                              betconstruct, bede, igc, kindredgroup, matchbook, 
                              plaingaming, rank, techsson, playfortuna, 
                              videoslots, leovegas (.. 126 more)
  -r, --rev <string>          Target revision (like r3.9.9.01) or from..to 
                              revision (like r3.9.9.0..r3.9.9.1)

Additional Options: (see global options)
```
### <a name="hermes-jackpot"></a>jackpot
Execute jackpot related migrations with spin locking
```
Usage: node deploy/hermes/jackpot --operator <string> 

Execute jackpot related migrations with spin locking

Options:
  -o, --operator <string>  [required] The target operator name. Available: 
                           bots, dope, islandluck, approv, betconstruct, bede, 
                           igc, kindredgroup, matchbook, plaingaming, rank, 
                           techsson, playfortuna, videoslots, leovegas (.. 126 
                           more)
  --jackpotSeed <string>   The target jackpot seed (must be located in 
                           seed/next folder)
  --platformSeed <string>  The target platform seed (must be located in 
                           seed/envs/next folder)

Additional Options: (see global options)
```
### <a name="hermes-migration"></a>migration
Auto execute SQL migrations to production
```
Usage: node deploy/hermes/migration --operators <name> --migration-path <name> --db <type> 

Auto execute SQL migrations to production

Options:
  -o, --operators <name>       [required] The target operator name. Available: 
                               bots, dope, islandluck, approv, betconstruct, 
                               bede, igc, kindredgroup, matchbook, plaingaming, 
                               rank, techsson, playfortuna, videoslots, 
                               leovegas (.. 126 more)
  -m, --migration-path <name>  [required] The path to migration sql file (like 
                               /d/www/_releases/hermes/.migrations/r3.9.16.9/gpanel-r3.9.16.9.sql
  --db <type>                  [required] The target database type. Available: 
                               platform, demo, panel, bonus, segments, stats, 
                               jackpot, tournaments, archive, reports

Additional Options: (see global options)
```
### <a name="hermes-sync-betlimits"></a>sync-betlimits
Sync operator bet limits without downtime
```
Usage: node deploy/hermes/sync-betlimits --operators <name> 

Sync operator bet limits without downtime

Options:
  -o, --operators <name>  [required] The target operator name. Available: bots, 
                          dope, islandluck, approv, betconstruct, bede, igc, 
                          kindredgroup, matchbook, plaingaming, rank, techsson, 
                          playfortuna, videoslots, leovegas (.. 126 more)
  --rollback              Will restore the previous state of the bet limits. In 
                          case of production errors this is the fastest route

Additional Options: (see global options)
```
### <a name="hermes-sync-games"></a>sync-games
Sync games and maths seeds
```
Usage: node deploy/hermes/sync-games --operators <name> 

Sync games and maths seeds

Options:
  -o, --operators <name>  [required] The target operator name. Available: bots, 
                          dope, islandluck, approv, betconstruct, bede, igc, 
                          kindredgroup, matchbook, plaingaming, rank, techsson, 
                          playfortuna, videoslots, leovegas (.. 126 more)
  -r, --rev <name>        The target revision or tag name. Useful for rollback

Additional Options: (see global options)
```
### <a name="hermes-update"></a>update
Fast simultaneous deploy to all operators per location without down time
```
Usage: node deploy/hermes/update --rev <string> 

Fast simultaneous deploy to all operators per location without down time

Options:
  -o, --operators <list|all>          Comma-separated list of operators. 
                                      Available: bots, dope, islandluck, 
                                      approv, betconstruct, bede, igc, 
                                      kindredgroup, matchbook, plaingaming, 
                                      rank, techsson, playfortuna, videoslots, 
                                      leovegas (.. 126 more)
  -r, --rev <string>                  [required] Target revision (like 
                                      r3.9.9.0) or from..to revision (like 
                                      r3.9.9.0..r3.9.9.1)
  -s, --strategy <direct|blue-green>  Choose deployment strategy. Available: 
                                      direct, blue-green (default: 
                                      "blue-green")
  --allow-panel                       Allow QA access to GPanel

Additional Options: (see global options)
```
### <a name="hermes-version"></a>version
Check current hermes release versions
```
Usage: node deploy/hermes/version --operators <list|all> 

Check current hermes release versions

Options:
  -o, --operators <list|all>  [required] Comma-separated list of operators. 
                              Available: bots, dope, islandluck, approv, 
                              betconstruct, bede, igc, kindredgroup, matchbook, 
                              plaingaming, rank, techsson, playfortuna, 
                              videoslots, leovegas (.. 126 more)

Additional Options: (see global options)
```
## <a name="monitoring"></a>monitoring
### <a name="monitoring-check"></a>check
Pre-deployment tests for Grafana-Sensors
```
Usage: node deploy/monitoring/check [options]

Pre-deployment tests for Grafana-Sensors

Options:

Additional Options: (see global options)
```
### <a name="monitoring-update"></a>update
Update Grafana-Sensors docker
```
Usage: node deploy/monitoring/update [options]

Update Grafana-Sensors docker

Options:

Additional Options: (see global options)
```
## <a name="prodmon"></a>prodmon
### <a name="prodmon-update"></a>update
Update Prod. Monitoring docker service
```
Usage: node deploy/prodmon/update [options]

Update Prod. Monitoring docker service

Options:

Additional Options: (see global options)
```
## <a name="safeguard"></a>safeguard
### <a name="safeguard-control"></a>control

```
Usage: node deploy/safeguard/control --locations <list|all> --mode <stop|start|restart> 

Options:
  -l, --locations <list|all>   [required] The target location (will be used 
                               web1). Available: belgium-sandbox, 
                               belgium-alderney, belgium-other, rockolo, 
                               taiwan, belgium-mga, bahamas
  --mode <stop|start|restart>  [required] The systemctl command to be executed. 
                               Available: stop, start, restart

Additional Options: (see global options)
```
### <a name="safeguard-setup"></a>setup
Installing safeguard
```
Usage: node deploy/safeguard/setup --locations <list|all> 

Installing safeguard

Options:
  -l, --locations <list|all>  [required] The target location (will be used 
                              web1). Available: belgium-sandbox, 
                              belgium-alderney, belgium-other, rockolo, taiwan, 
                              belgium-mga, bahamas

Additional Options: (see global options)
```
### <a name="safeguard-update-schema"></a>update-schema
Updating safeguard version
```
Usage: node deploy/safeguard/update-schema --locations <list|all> --migration-path <name> 

Updating safeguard version

Options:
  -l, --locations <list|all>   [required] The target location (will be used 
                               web1). Available: belgium-sandbox, 
                               belgium-alderney, belgium-other, rockolo, 
                               taiwan, belgium-mga, bahamas
  -m, --migration-path <name>  [required] The path to migration sql file (like 
                               /d/www/_releases/migrations/safeguard-update.sql

Additional Options: (see global options)
```
### <a name="safeguard-update"></a>update
Updating safeguard version
```
Usage: node deploy/safeguard/update --locations <list|all> --rev <tag> 

Updating safeguard version

Options:
  -l, --locations <list|all>  [required] The target location (will be used 
                              web1). Available: belgium-sandbox, 
                              belgium-alderney, belgium-other, rockolo, taiwan, 
                              belgium-mga, bahamas
  -r, --rev <tag>             [required] The target version as tag name

Additional Options: (see global options)
```
## <a name="ssl-framework"></a>ssl-framework
### <a name="ssl-framework-check"></a>check
Pre-deployment tests for SSL-Framework
```
Usage: node deploy/ssl-framework/check [options]

Pre-deployment tests for SSL-Framework

Options:

Additional Options: (see global options)
```
### <a name="ssl-framework-update"></a>update
Update SSL-Framework
```
Usage: node deploy/ssl-framework/update [options]

Update SSL-Framework

Options:

Additional Options: (see global options)
```
## <a name="sys-metrics"></a>sys-metrics
### <a name="sys-metrics-check"></a>check

```
Usage: node deploy/sys-metrics/check --hosts <list|all> 

Options:
  -h, --hosts <list|all>  [required] The target host names. Available: 
                          belgium-sandbox-math1, belgium-sandbox-math2, 
                          belgium-sandbox-bots1, belgium-sandbox-bots2, 
                          belgium-sandbox-lb1, belgium-sandbox-mariadb-master1, 
                          belgium-sandbox-mariadb-slave1, 
                          belgium-sandbox-db-archive, belgium-sandbox-web1, 
                          belgium-sandbox-web2, belgium-sandbox-web3, 
                          belgium-mga-db-exalogic-db1-master1, 
                          belgium-mga-exalogic-wspgda1-web1, 
                          belgium-mga-mariadb-jackpots-master1, 
                          belgium-mga-mariadb-jackpots-slave1 (.. 163 more)

Additional Options: (see global options)
```
### <a name="sys-metrics-init"></a>init
Installing sys-metrics
```
Usage: node deploy/sys-metrics/init --hosts <list> 

Installing sys-metrics

Options:
  -h, --hosts <list>      [required] The target host names. Available: 
                          belgium-sandbox-math1, belgium-sandbox-math2, 
                          belgium-sandbox-bots1, belgium-sandbox-bots2, 
                          belgium-sandbox-lb1, belgium-sandbox-mariadb-master1, 
                          belgium-sandbox-mariadb-slave1, 
                          belgium-sandbox-db-archive, belgium-sandbox-web1, 
                          belgium-sandbox-web2, belgium-sandbox-web3, 
                          belgium-mga-db-exalogic-db1-master1, 
                          belgium-mga-exalogic-wspgda1-web1, 
                          belgium-mga-mariadb-jackpots-master1, 
                          belgium-mga-mariadb-jackpots-slave1 (.. 163 more)
  --install-deps          Install required deps in case the vm is not unified

Additional Options: (see global options)
```
### <a name="sys-metrics-restart"></a>restart

```
Usage: node deploy/sys-metrics/restart --hosts <list|all> 

Options:
  -h, --hosts <list|all>  [required] The target host names. Available: 
                          belgium-sandbox-math1, belgium-sandbox-math2, 
                          belgium-sandbox-bots1, belgium-sandbox-bots2, 
                          belgium-sandbox-lb1, belgium-sandbox-mariadb-master1, 
                          belgium-sandbox-mariadb-slave1, 
                          belgium-sandbox-db-archive, belgium-sandbox-web1, 
                          belgium-sandbox-web2, belgium-sandbox-web3, 
                          belgium-mga-db-exalogic-db1-master1, 
                          belgium-mga-exalogic-wspgda1-web1, 
                          belgium-mga-mariadb-jackpots-master1, 
                          belgium-mga-mariadb-jackpots-slave1 (.. 163 more)

Additional Options: (see global options)
```
### <a name="sys-metrics-stop"></a>stop

```
Usage: node deploy/sys-metrics/stop --hosts <list|all> 

Options:
  -h, --hosts <list|all>  [required] The target host names. Available: 
                          belgium-sandbox-math1, belgium-sandbox-math2, 
                          belgium-sandbox-bots1, belgium-sandbox-bots2, 
                          belgium-sandbox-lb1, belgium-sandbox-mariadb-master1, 
                          belgium-sandbox-mariadb-slave1, 
                          belgium-sandbox-db-archive, belgium-sandbox-web1, 
                          belgium-sandbox-web2, belgium-sandbox-web3, 
                          belgium-mga-db-exalogic-db1-master1, 
                          belgium-mga-exalogic-wspgda1-web1, 
                          belgium-mga-mariadb-jackpots-master1, 
                          belgium-mga-mariadb-jackpots-slave1 (.. 163 more)

Additional Options: (see global options)
```
### <a name="sys-metrics-update"></a>update
Updating sys-metrics version
```
Usage: node deploy/sys-metrics/update --hosts <list|all> --rev <tag> 

Updating sys-metrics version

Options:
  -h, --hosts <list|all>  [required] The target host names. Available: 
                          belgium-sandbox-math1, belgium-sandbox-math2, 
                          belgium-sandbox-bots1, belgium-sandbox-bots2, 
                          belgium-sandbox-lb1, belgium-sandbox-mariadb-master1, 
                          belgium-sandbox-mariadb-slave1, 
                          belgium-sandbox-db-archive, belgium-sandbox-web1, 
                          belgium-sandbox-web2, belgium-sandbox-web3, 
                          belgium-mga-db-exalogic-db1-master1, 
                          belgium-mga-exalogic-wspgda1-web1, 
                          belgium-mga-mariadb-jackpots-master1, 
                          belgium-mga-mariadb-jackpots-slave1 (.. 163 more)
  -r, --rev <tag>         [required] The target version as tag name

Additional Options: (see global options)
```
