## Available programs:

* [cdn](#cdn)
    * [check](#cdn-check)
    * [update](#cdn-update)
    * [version](#cdn-version)
* [cloudflare](#cloudflare)
    * [check](#cdn-check)
    * [get](#cdn-get)
    * [unify-page-rules](#cdn-unify-page-rules)
    * [unify-pages](#cdn-unify-pages)
    * [unify-settings](#cdn-unify-settings)
* [docs](#docs)
    * [generate](#cdn-generate)
* [hermes](#hermes)
    * [allow-panel-access](#cdn-allow-panel-access)
    * [check](#cdn-check)
    * [update](#cdn-update)
    * [version](#cdn-version)
* [hermes-env](#hermes-env)
    * [check](#cdn-check)
    * [create](#cdn-create)
    * [destroy](#cdn-destroy)
    * [prepare](#cdn-prepare)
* [php-binary](#php-binary)
    * [check](#cdn-check)
    * [init](#cdn-init)
* [servers-conf](#servers-conf)
    * [list-changes](#cdn-list-changes)
    * [update](#cdn-update)
* [sys-metrics](#sys-metrics)
    * [check](#cdn-check)
    * [init](#cdn-init)
    * [restart](#cdn-restart)
    * [stop](#cdn-stop)
    * [update](#cdn-update)
* [vm-setup](#vm-setup)
    * [known-hosts](#cdn-known-hosts)

## Help
## <a name="cdn"></a>cdn
### check
```
node bin/cdn/check --help

Usage: check [options]

  Test suit of games cdn

  Options:

    -p, --parallel [limit]   When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose            Turn ON log details of whats happening
    -f, --force              Suppress confirm messages (used for automation)
    -n, --dry-run            Dry run mode will do everything as usual except commands execution
    -q, --quiet              Turn off chat and some logs in stdout
    -V, --version            output the version number
    -h, --hosts <list|all>   [required] Comma-separated list of cdn regions. Available: dev-hermes-lb,cdn-asia,cdn-europe,cdn-backup Available: dev-hermes-lb,cdn-asia,cdn-europe,cdn-backup
    -r, --revision <string>  Target revision (like r.3.9.9.0)
    -m, --mode <blue|green>  [required] Which cdn to by updated Available: blue,green
    -h, --help               output usage information
```
### update
```
node bin/cdn/update --help

Usage: update [options]

  Update games cdn

  Options:

    -p, --parallel [limit]   When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose            Turn ON log details of whats happening
    -f, --force              Suppress confirm messages (used for automation)
    -n, --dry-run            Dry run mode will do everything as usual except commands execution
    -q, --quiet              Turn off chat and some logs in stdout
    -V, --version            output the version number
    -h, --hosts <list|all>   [required] Comma-separated list of cdn regions. Available: dev-hermes-lb,cdn-asia,cdn-europe,cdn-backup Available: dev-hermes-lb,cdn-asia,cdn-europe,cdn-backup
    -r, --revision <string>  Target revision (like r.3.9.9.0)
    -m, --mode <blue|green>  [required] Which cdn to by updated Available: blue,green
    -h, --help               output usage information
```
### version
```
node bin/cdn/version --help

Usage: version [options]

  Checking current release version of games cdn

  Options:

    -p, --parallel [limit]   When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose            Turn ON log details of whats happening
    -f, --force              Suppress confirm messages (used for automation)
    -n, --dry-run            Dry run mode will do everything as usual except commands execution
    -q, --quiet              Turn off chat and some logs in stdout
    -V, --version            output the version number
    -h, --hosts <list|all>   [required] Comma-separated list of cdn regions. Available: dev-hermes-lb,cdn-asia,cdn-europe,cdn-backup Available: dev-hermes-lb,cdn-asia,cdn-europe,cdn-backup
    -m, --mode <blue|green>  Which cdn to by checked. By default will check both Available: blue,green
    -h, --help               output usage information
```
## <a name="cloudflare"></a>cloudflare
### check
```
node bin/cloudflare/check --help

Usage: check [options]

  Checking current cloudflare configuration

  Options:

    -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose           Turn ON log details of whats happening
    -f, --force             Suppress confirm messages (used for automation)
    -n, --dry-run           Dry run mode will do everything as usual except commands execution
    -q, --quiet             Turn off chat and some logs in stdout
    -V, --version           output the version number
    -z, --zones <list|all>  [required] Comma-separated list of cloudflare zone aliases. Available: dopamine-gaming.com,rtggib.cash,tgp.cash,redtiger.cash,m-gservices.com,redtiger-demo.com Available: dopamine-gaming.com,rtggib.cash,tgp.cash,redtiger.cash,m-gservices.com,redtiger-demo.com
    -h, --help              output usage information
```
### get
```
node bin/cloudflare/get --help

Usage: get [options]

  Checking current cloudflare configuration

  Options:

    -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose           Turn ON log details of whats happening
    -f, --force             Suppress confirm messages (used for automation)
    -n, --dry-run           Dry run mode will do everything as usual except commands execution
    -q, --quiet             Turn off chat and some logs in stdout
    -V, --version           output the version number
    -z, --zones <list|all>  [required] Comma-separated list of cloudflare zone aliases. Available: dopamine-gaming.com,rtggib.cash,tgp.cash,redtiger.cash,m-gservices.com,redtiger-demo.com Available: dopamine-gaming.com,rtggib.cash,tgp.cash,redtiger.cash,m-gservices.com,redtiger-demo.com
    -u, --url <string>      Cloudflare url without the zone part (default: settings/security_level)
    -h, --help              output usage information
```
### unify-page-rules
```
node bin/cloudflare/unify-page-rules --help

Usage: unify-page-rules [options]

  Unifying cloudflare configuration

  Options:

    -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose           Turn ON log details of whats happening
    -f, --force             Suppress confirm messages (used for automation)
    -n, --dry-run           Dry run mode will do everything as usual except commands execution
    -q, --quiet             Turn off chat and some logs in stdout
    -V, --version           output the version number
    -z, --zones <list|all>  [required] Comma-separated list of cloudflare zone aliases. Available: dopamine-gaming.com,rtggib.cash,tgp.cash,redtiger.cash,m-gservices.com,redtiger-demo.com Available: dopamine-gaming.com,rtggib.cash,tgp.cash,redtiger.cash,m-gservices.com,redtiger-demo.com
    -h, --help              output usage information
```
### unify-pages
```
node bin/cloudflare/unify-pages --help

Usage: unify-pages [options]

  Unifying cloudflare configuration

  Options:

    -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose           Turn ON log details of whats happening
    -f, --force             Suppress confirm messages (used for automation)
    -n, --dry-run           Dry run mode will do everything as usual except commands execution
    -q, --quiet             Turn off chat and some logs in stdout
    -V, --version           output the version number
    -z, --zones <list|all>  [required] Comma-separated list of cloudflare zone aliases. Available: dopamine-gaming.com,rtggib.cash,tgp.cash,redtiger.cash,m-gservices.com,redtiger-demo.com Available: dopamine-gaming.com,rtggib.cash,tgp.cash,redtiger.cash,m-gservices.com,redtiger-demo.com
    -h, --help              output usage information
```
### unify-settings
```
node bin/cloudflare/unify-settings --help

Usage: unify-settings [options]

  Unifying cloudflare configuration

  Options:

    -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose           Turn ON log details of whats happening
    -f, --force             Suppress confirm messages (used for automation)
    -n, --dry-run           Dry run mode will do everything as usual except commands execution
    -q, --quiet             Turn off chat and some logs in stdout
    -V, --version           output the version number
    -z, --zones <list|all>  [required] Comma-separated list of cloudflare zone aliases. Available: dopamine-gaming.com,rtggib.cash,tgp.cash,redtiger.cash,m-gservices.com,redtiger-demo.com Available: dopamine-gaming.com,rtggib.cash,tgp.cash,redtiger.cash,m-gservices.com,redtiger-demo.com
    -h, --help              output usage information
```
## <a name="docs"></a>docs
### generate
```
node bin/docs/generate --help

Usage: generate [options]

  Auto-generate README files with commands help

  Options:

    -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose           Turn ON log details of whats happening
    -f, --force             Suppress confirm messages (used for automation)
    -n, --dry-run           Dry run mode will do everything as usual except commands execution
    -q, --quiet             Turn off chat and some logs in stdout
    -V, --version           output the version number
    -h, --help              output usage information
```
## <a name="hermes"></a>hermes
### allow-panel-access
```
node bin/hermes/allow-panel-access --help

Usage: allow-panel-access [options]

  Checking current cloudflare configuration

  Options:

    -p, --parallel [limit]      When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose               Turn ON log details of whats happening
    -f, --force                 Suppress confirm messages (used for automation)
    -n, --dry-run               Dry run mode will do everything as usual except commands execution
    -q, --quiet                 Turn off chat and some logs in stdout
    -V, --version               output the version number
    -o, --operators <list|all>  [required] Comma-separated list of operators. Available: rtg,bots,approv,betconstruct,bede,betfairmars,igc,kindred,matchbook,plaingaming,paddymars,rank,techsson,ugseu,videoslots,leovegas,mrgreen,sunbingo,pomadorro,pinnacle,marketing15,coingaming,williamhill,gvc,pop,gamesys,nektan,138global,aggfun,ugs2,ugs4,ugs3,ugs1,pokerstars Available: rtg,bots,approv,betconstruct,bede,betfairmars,igc,kindred,matchbook,plaingaming,paddymars,rank,techsson,ugseu,videoslots,leovegas,mrgreen,sunbingo,pomadorro,pinnacle,marketing15,coingaming,williamhill,gvc,pop,gamesys,nektan,138global,aggfun,ugs2,ugs4,ugs3,ugs1,pokerstars
    -m, --minutes <int>         Expire after defined minutes (default: 15)
    -r, --role <string>         Define admin role Available: RT_QAPROD,EXT_Marketing (default: RT_QAPROD)
    -h, --help                  output usage information
```
### check
```
node bin/hermes/check --help

Usage: check [options]

  Checking current cloudflare configuration

  Options:

    -p, --parallel [limit]      When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose               Turn ON log details of whats happening
    -f, --force                 Suppress confirm messages (used for automation)
    -n, --dry-run               Dry run mode will do everything as usual except commands execution
    -q, --quiet                 Turn off chat and some logs in stdout
    -V, --version               output the version number
    -o, --operators <list|all>  [required] Comma-separated list of operators. Available: rtg,bots,approv,betconstruct,bede,betfairmars,igc,kindred,matchbook,plaingaming,paddymars,rank,techsson,ugseu,videoslots,leovegas,mrgreen,sunbingo,pomadorro,pinnacle,marketing15,coingaming,williamhill,gvc,pop,gamesys,nektan,138global,aggfun,ugs2,ugs4,ugs3,ugs1,pokerstars Available: rtg,bots,approv,betconstruct,bede,betfairmars,igc,kindred,matchbook,plaingaming,paddymars,rank,techsson,ugseu,videoslots,leovegas,mrgreen,sunbingo,pomadorro,pinnacle,marketing15,coingaming,williamhill,gvc,pop,gamesys,nektan,138global,aggfun,ugs2,ugs4,ugs3,ugs1,pokerstars
    -r, --revision <string>     Target revision (like r.3.9.9.0) or from..to revision (like r3.9.9.0..r3.9.9.1)
    -h, --help                  output usage information
```
### update
```
node bin/hermes/update --help

Usage: update [options]

  Checking current cloudflare configuration

  Options:

    -p, --parallel [limit]      When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose               Turn ON log details of whats happening
    -f, --force                 Suppress confirm messages (used for automation)
    -n, --dry-run               Dry run mode will do everything as usual except commands execution
    -q, --quiet                 Turn off chat and some logs in stdout
    -V, --version               output the version number
    -o, --operators <list|all>  [required] Comma-separated list of operators. Available: rtg,bots,approv,betconstruct,bede,betfairmars,igc,kindred,matchbook,plaingaming,paddymars,rank,techsson,ugseu,videoslots,leovegas,mrgreen,sunbingo,pomadorro,pinnacle,marketing15,coingaming,williamhill,gvc,pop,gamesys,nektan,138global,aggfun,ugs2,ugs4,ugs3,ugs1,pokerstars Available: rtg,bots,approv,betconstruct,bede,betfairmars,igc,kindred,matchbook,plaingaming,paddymars,rank,techsson,ugseu,videoslots,leovegas,mrgreen,sunbingo,pomadorro,pinnacle,marketing15,coingaming,williamhill,gvc,pop,gamesys,nektan,138global,aggfun,ugs2,ugs4,ugs3,ugs1,pokerstars
    -r, --revision <string>     [required] Target revision (like r.3.9.9.0) or from..to revision (like r3.9.9.0..r3.9.9.1)
    -a, --allow-panel           Allow QA access to GPanel
    -h, --help                  output usage information
```
### version
```
node bin/hermes/version --help

Usage: version [options]

  Checking current cloudflare configuration

  Options:

    -p, --parallel [limit]      When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose               Turn ON log details of whats happening
    -f, --force                 Suppress confirm messages (used for automation)
    -n, --dry-run               Dry run mode will do everything as usual except commands execution
    -q, --quiet                 Turn off chat and some logs in stdout
    -V, --version               output the version number
    -o, --operators <list|all>  [required] Comma-separated list of operators. Available: rtg,bots,approv,betconstruct,bede,betfairmars,igc,kindred,matchbook,plaingaming,paddymars,rank,techsson,ugseu,videoslots,leovegas,mrgreen,sunbingo,pomadorro,pinnacle,marketing15,coingaming,williamhill,gvc,pop,gamesys,nektan,138global,aggfun,ugs2,ugs4,ugs3,ugs1,pokerstars Available: rtg,bots,approv,betconstruct,bede,betfairmars,igc,kindred,matchbook,plaingaming,paddymars,rank,techsson,ugseu,videoslots,leovegas,mrgreen,sunbingo,pomadorro,pinnacle,marketing15,coingaming,williamhill,gvc,pop,gamesys,nektan,138global,aggfun,ugs2,ugs4,ugs3,ugs1,pokerstars
    -h, --help                  output usage information
```
## <a name="hermes-env"></a>hermes-env
### check
```
node bin/hermes-env/check --help

Usage: check [options]

  Options:

    -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose           Turn ON log details of whats happening
    -f, --force             Suppress confirm messages (used for automation)
    -n, --dry-run           Dry run mode will do everything as usual except commands execution
    -q, --quiet             Turn off chat and some logs in stdout
    -V, --version           output the version number
    -e, --env <name>        [required] The target env name
    -l, --location <name>   [required] The target location
    -h, --help              output usage information
```
### create
```
node bin/hermes-env/create --help

Usage: create [options]

  Options:

    -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose           Turn ON log details of whats happening
    -f, --force             Suppress confirm messages (used for automation)
    -n, --dry-run           Dry run mode will do everything as usual except commands execution
    -q, --quiet             Turn off chat and some logs in stdout
    -V, --version           output the version number
    -e, --env <name>        [required] The target env name
    -l, --location <name>   [required] The target location
    -h, --help              output usage information
```
### destroy
```
node bin/hermes-env/destroy --help

Usage: destroy [options]

  Options:

    -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose           Turn ON log details of whats happening
    -f, --force             Suppress confirm messages (used for automation)
    -n, --dry-run           Dry run mode will do everything as usual except commands execution
    -q, --quiet             Turn off chat and some logs in stdout
    -V, --version           output the version number
    -e, --env <name>        [required] The target env name
    -l, --location <name>   [required] The target location
    -h, --help              output usage information
```
### prepare
```
node bin/hermes-env/prepare --help

Usage: prepare [options]

  Options:

    -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose           Turn ON log details of whats happening
    -f, --force             Suppress confirm messages (used for automation)
    -n, --dry-run           Dry run mode will do everything as usual except commands execution
    -q, --quiet             Turn off chat and some logs in stdout
    -V, --version           output the version number
    -e, --env <name>        [required] The target env name
    -l, --location <name>   [required] The target location
    -h, --help              output usage information
```
## <a name="php-binary"></a>php-binary
### check
```
node bin/php-binary/check --help

Usage: check [options]

  Options:

    -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose           Turn ON log details of whats happening
    -f, --force             Suppress confirm messages (used for automation)
    -n, --dry-run           Dry run mode will do everything as usual except commands execution
    -q, --quiet             Turn off chat and some logs in stdout
    -V, --version           output the version number
    -h, --hosts <list|all>  [required] The target host name Available: dev-hermes-web1,dev-hermes-web2,belgium-web1,belgium-web2,manila-web1,manila-web2,manila-web3,manila-web4,manila-web5,iom-web1,iom-web2,iom-web3,iom-web4,iom-web5,tw-web1,tw-web2,tw-web3,tw-web4,tw-web5,gib-web1,gib-web2,gib-web3,gib-web4,gib-web5,pokerstars-web1,pokerstars-web2,pokerstars-web3,pokerstars-web4,pokerstars-web5
    -h, --help              output usage information
```
### init
```
node bin/php-binary/init --help

Usage: init [options]

  Options:

    -p, --parallel [limit]      When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose               Turn ON log details of whats happening
    -f, --force                 Suppress confirm messages (used for automation)
    -n, --dry-run               Dry run mode will do everything as usual except commands execution
    -q, --quiet                 Turn off chat and some logs in stdout
    -V, --version               output the version number
    -h, --hosts <list|all>      [required] The target host name Available: dev-hermes-web1,dev-hermes-web2,belgium-web1,belgium-web2,manila-web1,manila-web2,manila-web3,manila-web4,manila-web5,iom-web1,iom-web2,iom-web3,iom-web4,iom-web5,tw-web1,tw-web2,tw-web3,tw-web4,tw-web5,gib-web1,gib-web2,gib-web3,gib-web4,gib-web5,pokerstars-web1,pokerstars-web2,pokerstars-web3,pokerstars-web4,pokerstars-web5
    -p, --phpversion <version>  [required] The php version number Available: 7.1.19,7.1.20,7.2.6 (default: 7.1.20)
    -h, --help                  output usage information
```
## <a name="servers-conf"></a>servers-conf
### list-changes
```
node bin/servers-conf/list-changes --help

Usage: list-changes [options]

  Options:

    -p, --parallel [limit]      When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose               Turn ON log details of whats happening
    -f, --force                 Suppress confirm messages (used for automation)
    -n, --dry-run               Dry run mode will do everything as usual except commands execution
    -q, --quiet                 Turn off chat and some logs in stdout
    -V, --version               output the version number
    -l, --locations <list|all>  [required] The target host name Available: dev,gib,manila,taiwan,pokerstars,iom,belgium
    -h, --help                  output usage information
```
### update
```
node bin/servers-conf/update --help

Usage: update [options]

  Auto update sever configurations by reloading one by one each server

  Options:

    -p, --parallel [limit]      When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose               Turn ON log details of whats happening
    -f, --force                 Suppress confirm messages (used for automation)
    -n, --dry-run               Dry run mode will do everything as usual except commands execution
    -q, --quiet                 Turn off chat and some logs in stdout
    -V, --version               output the version number
    -l, --locations <list|all>  [required] The target host name Available: dev,gib,manila,taiwan,pokerstars,iom,belgium
    -r, --rev <string>          Specify target git revision, very useful for rollback. Default reset to origin/master
    -i, --interval <int>        How many seconds to wait between each configuration switch. Default is 2
    -f, --force                 Skip manual changes validations and proceed on your risk
    --no-wait                   Skip waiting for active php processes to end and other safety delays. WARNING: this will break current php processes in the middle of their execution causing strange errors.
    --only-nginx                Update all configurations but restarts only the nginx service (so php-fpm will be not updated)
    --with-nginx-upgrade        Update all configurations but restarts only the nginx service USING UPGRADE method (so php-fpm will be not updated)
    -h, --help                  output usage information
```
## <a name="sys-metrics"></a>sys-metrics
### check
```
node bin/sys-metrics/check --help

Usage: check [options]

  Options:

    -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose           Turn ON log details of whats happening
    -f, --force             Suppress confirm messages (used for automation)
    -n, --dry-run           Dry run mode will do everything as usual except commands execution
    -q, --quiet             Turn off chat and some logs in stdout
    -V, --version           output the version number
    -h, --hosts <list|all>  [required] The target host names Available: git,sofia-mysql-backup-pokerstars,sofia-mysql-backup-manila,sofia-mysql-backup-iom,sofia-mysql-backup-manial-taiwan,sofia-mysql-mirror-pokerstars,sofia-mysql-mirror-manila-taiwan,sofia-mysql-mirror-manila,sofia-mysql-mirror-iom,sofia-mysql-mirror-gib,sofia-mysql-backup-pokerstars-archive,sofia-mysql-backup-manila-archive,sofia-mysql-backup-iom-archive,sofia-mysql-backup-gib-archive,sofia-mysql-backup-gib,sofia-logserver,sofia-syslog,dev-hermes-lb,dev-hermes-sql,dev-hermes-web1,dev-hermes-web2,france-srv1,cdn-europe,cdn-asia,cdn-backup,pokerstars-web1,pokerstars-web2,pokerstars-web3,pokerstars-web4,pokerstars-web5,pokerstars-lb1,pokerstars-lb2,pokerstars-system,pokerstars-sql1,pokerstars-sql2,pokerstars-sql3,pokerstars-mysql-archive,iom-lb,iom-mysql-new,iom-mysql-archive,iom-slave,iom-web1,iom-web2,iom-web3,iom-web4,iom-web5,iom-system,iom-3thparty-web1,iom-3thparty-web2,gib-lb1,gib-web1,gib-web2,gib-web3,gib-web4,gib-web5,gib-mysql,gib-mysql-slave,gib-mysql-archive,manila-lb,manila-mysql,manila-mysql-archive,manila-slave,manila-system,manila-web1,manila-web2,manila-web3,manila-web4,manila-web5,manila-tw-mysql,manila-tw-mysql-archive,tw-lb,tw-mysql,tw-mysql-archive,tw-mysql-slave,tw-web1,tw-web2,tw-web3,tw-web4,tw-web5,belgium-lb,belgium-mysql,belgium-web1,belgium-web2,data-warehouse
    -h, --help              output usage information
```
### init
```
node bin/sys-metrics/init --help

Usage: init [options]

  Installing sys-metrics

  Options:

    -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose           Turn ON log details of whats happening
    -f, --force             Suppress confirm messages (used for automation)
    -n, --dry-run           Dry run mode will do everything as usual except commands execution
    -q, --quiet             Turn off chat and some logs in stdout
    -V, --version           output the version number
    -h, --hosts <list>      [required] The target host names
    -h, --help              output usage information
```
### restart
```
node bin/sys-metrics/restart --help

Usage: restart [options]

  Options:

    -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose           Turn ON log details of whats happening
    -f, --force             Suppress confirm messages (used for automation)
    -n, --dry-run           Dry run mode will do everything as usual except commands execution
    -q, --quiet             Turn off chat and some logs in stdout
    -V, --version           output the version number
    -h, --hosts <list|all>  [required] The target host names Available: git,sofia-mysql-backup-pokerstars,sofia-mysql-backup-manila,sofia-mysql-backup-iom,sofia-mysql-backup-manial-taiwan,sofia-mysql-mirror-pokerstars,sofia-mysql-mirror-manila-taiwan,sofia-mysql-mirror-manila,sofia-mysql-mirror-iom,sofia-mysql-mirror-gib,sofia-mysql-backup-pokerstars-archive,sofia-mysql-backup-manila-archive,sofia-mysql-backup-iom-archive,sofia-mysql-backup-gib-archive,sofia-mysql-backup-gib,sofia-logserver,sofia-syslog,dev-hermes-lb,dev-hermes-sql,dev-hermes-web1,dev-hermes-web2,france-srv1,cdn-europe,cdn-asia,cdn-backup,pokerstars-web1,pokerstars-web2,pokerstars-web3,pokerstars-web4,pokerstars-web5,pokerstars-lb1,pokerstars-lb2,pokerstars-system,pokerstars-sql1,pokerstars-sql2,pokerstars-sql3,pokerstars-mysql-archive,iom-lb,iom-mysql-new,iom-mysql-archive,iom-slave,iom-web1,iom-web2,iom-web3,iom-web4,iom-web5,iom-system,iom-3thparty-web1,iom-3thparty-web2,gib-lb1,gib-web1,gib-web2,gib-web3,gib-web4,gib-web5,gib-mysql,gib-mysql-slave,gib-mysql-archive,manila-lb,manila-mysql,manila-mysql-archive,manila-slave,manila-system,manila-web1,manila-web2,manila-web3,manila-web4,manila-web5,manila-tw-mysql,manila-tw-mysql-archive,tw-lb,tw-mysql,tw-mysql-archive,tw-mysql-slave,tw-web1,tw-web2,tw-web3,tw-web4,tw-web5,belgium-lb,belgium-mysql,belgium-web1,belgium-web2,data-warehouse
    -h, --help              output usage information
```
### stop
```
node bin/sys-metrics/stop --help

Usage: stop [options]

  Options:

    -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose           Turn ON log details of whats happening
    -f, --force             Suppress confirm messages (used for automation)
    -n, --dry-run           Dry run mode will do everything as usual except commands execution
    -q, --quiet             Turn off chat and some logs in stdout
    -V, --version           output the version number
    -h, --hosts <list|all>  [required] The target host names Available: git,sofia-mysql-backup-pokerstars,sofia-mysql-backup-manila,sofia-mysql-backup-iom,sofia-mysql-backup-manial-taiwan,sofia-mysql-mirror-pokerstars,sofia-mysql-mirror-manila-taiwan,sofia-mysql-mirror-manila,sofia-mysql-mirror-iom,sofia-mysql-mirror-gib,sofia-mysql-backup-pokerstars-archive,sofia-mysql-backup-manila-archive,sofia-mysql-backup-iom-archive,sofia-mysql-backup-gib-archive,sofia-mysql-backup-gib,sofia-logserver,sofia-syslog,dev-hermes-lb,dev-hermes-sql,dev-hermes-web1,dev-hermes-web2,france-srv1,cdn-europe,cdn-asia,cdn-backup,pokerstars-web1,pokerstars-web2,pokerstars-web3,pokerstars-web4,pokerstars-web5,pokerstars-lb1,pokerstars-lb2,pokerstars-system,pokerstars-sql1,pokerstars-sql2,pokerstars-sql3,pokerstars-mysql-archive,iom-lb,iom-mysql-new,iom-mysql-archive,iom-slave,iom-web1,iom-web2,iom-web3,iom-web4,iom-web5,iom-system,iom-3thparty-web1,iom-3thparty-web2,gib-lb1,gib-web1,gib-web2,gib-web3,gib-web4,gib-web5,gib-mysql,gib-mysql-slave,gib-mysql-archive,manila-lb,manila-mysql,manila-mysql-archive,manila-slave,manila-system,manila-web1,manila-web2,manila-web3,manila-web4,manila-web5,manila-tw-mysql,manila-tw-mysql-archive,tw-lb,tw-mysql,tw-mysql-archive,tw-mysql-slave,tw-web1,tw-web2,tw-web3,tw-web4,tw-web5,belgium-lb,belgium-mysql,belgium-web1,belgium-web2,data-warehouse
    -h, --help              output usage information
```
### update
```
node bin/sys-metrics/update --help

Usage: update [options]

  Updating sys-metrics version

  Options:

    -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose           Turn ON log details of whats happening
    -f, --force             Suppress confirm messages (used for automation)
    -n, --dry-run           Dry run mode will do everything as usual except commands execution
    -q, --quiet             Turn off chat and some logs in stdout
    -V, --version           output the version number
    -h, --hosts <list|all>  [required] The target host names Available: git,sofia-mysql-backup-pokerstars,sofia-mysql-backup-manila,sofia-mysql-backup-iom,sofia-mysql-backup-manial-taiwan,sofia-mysql-mirror-pokerstars,sofia-mysql-mirror-manila-taiwan,sofia-mysql-mirror-manila,sofia-mysql-mirror-iom,sofia-mysql-mirror-gib,sofia-mysql-backup-pokerstars-archive,sofia-mysql-backup-manila-archive,sofia-mysql-backup-iom-archive,sofia-mysql-backup-gib-archive,sofia-mysql-backup-gib,sofia-logserver,sofia-syslog,dev-hermes-lb,dev-hermes-sql,dev-hermes-web1,dev-hermes-web2,france-srv1,cdn-europe,cdn-asia,cdn-backup,pokerstars-web1,pokerstars-web2,pokerstars-web3,pokerstars-web4,pokerstars-web5,pokerstars-lb1,pokerstars-lb2,pokerstars-system,pokerstars-sql1,pokerstars-sql2,pokerstars-sql3,pokerstars-mysql-archive,iom-lb,iom-mysql-new,iom-mysql-archive,iom-slave,iom-web1,iom-web2,iom-web3,iom-web4,iom-web5,iom-system,iom-3thparty-web1,iom-3thparty-web2,gib-lb1,gib-web1,gib-web2,gib-web3,gib-web4,gib-web5,gib-mysql,gib-mysql-slave,gib-mysql-archive,manila-lb,manila-mysql,manila-mysql-archive,manila-slave,manila-system,manila-web1,manila-web2,manila-web3,manila-web4,manila-web5,manila-tw-mysql,manila-tw-mysql-archive,tw-lb,tw-mysql,tw-mysql-archive,tw-mysql-slave,tw-web1,tw-web2,tw-web3,tw-web4,tw-web5,belgium-lb,belgium-mysql,belgium-web1,belgium-web2,data-warehouse
    -r, --revision <tag>    [required] The target version as tag name
    -h, --help              output usage information
```
## <a name="vm-setup"></a>vm-setup
### known-hosts
```
node bin/vm-setup/known-hosts --help

Usage: known-hosts [options]

  Options:

    -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose           Turn ON log details of whats happening
    -f, --force             Suppress confirm messages (used for automation)
    -n, --dry-run           Dry run mode will do everything as usual except commands execution
    -q, --quiet             Turn off chat and some logs in stdout
    -V, --version           output the version number
    -h, --hosts <list|all>  [required] The target host names Available: belgium-lb,belgium-mysql-master,belgium-web1,belgium-web2,cdn-asia,cdn-backup,cdn-europe,data-warehouse,dev-hermes-lb,dev-hermes-sql,dev-hermes-web1,dev-hermes-web2,france-srv1,gib-lb,gib-mysql,gib-mysql-archive,gib-mysql-slave,gib-srv1,gib-srv2,gib-srv3,gib-web1,gib-web2,gib-web3,gib-web4,gib-web5,iom-java1,iom-java2,iom-lb,iom-mysql,iom-mysql-archive,iom-mysql-slave,iom-srv1,iom-srv2,iom-srv3,iom-srv4,iom-system,iom-web1,iom-web2,iom-web3,iom-web4,iom-web5,malta-srv1,manila-lb,manila-mysql,manila-mysql-archive,manila-mysql-slave,manila-mysql-staging,manila-srv1,manila-srv2,manila-srv3,manila-system,manila-web1,manila-web2,manila-web3,manila-web4,manila-web5,monitoring,pokerstars-lb,pokerstars-lb-staging,pokerstars-mysql,pokerstars-mysql-archive,pokerstars-mysql-slave,pokerstars-mysql-staging,pokerstars-system,pokerstars-web1,pokerstars-web2,pokerstars-web3,pokerstars-web4,pokerstars-web5,sofia-central-sql,sofia-mysql-backup-gib,sofia-mysql-backup-gib-archive,sofia-mysql-backup-iom,sofia-mysql-backup-iom-archive,sofia-mysql-backup-manila,sofia-mysql-backup-manila-archive,sofia-mysql-backup-pokerstars,sofia-mysql-backup-pokerstars-archive,sofia-mysql-backup-tw,sofia-mysql-backup-tw-archive,sofia-mysql-mirror-belgium,sofia-mysql-mirror-gib,sofia-mysql-mirror-gib-new,sofia-mysql-mirror-iom,sofia-mysql-mirror-iom-new,sofia-mysql-mirror-manila,sofia-mysql-mirror-manila-new,sofia-mysql-mirror-pokerstars,sofia-mysql-mirror-pokerstars-new,sofia-mysql-mirror-tw,sofia-mysql-mirror-tw-new,tw-lb,tw-mysql,tw-mysql-archive,tw-mysql-slave,tw-mysql-slave2,tw-web1,tw-web2,tw-web3,tw-web4,tw-web5
    -h, --help              output usage information
```
