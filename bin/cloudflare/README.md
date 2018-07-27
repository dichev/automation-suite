# cloudflare
### check
Check current cloudflare configuration
```
node bin/cloudflare/check --help

  Usage: check --zones <list|all> 

  Check current cloudflare configuration

  Options:

    -z, --zones <list|all>  [required] Comma-separated list of cloudflare zone aliases. Available: dopamine-gaming.com,rtggib.cash,tgp.cash,redtiger.cash,m-gservices.com,redtiger-demo.com Available: dopamine-gaming.com,rtggib.cash,tgp.cash,redtiger.cash,m-gservices.com,redtiger-demo.com
    -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose           Turn ON log details of whats happening
    -f, --force             Suppress confirm messages (used for automation)
    -n, --dry-run           Dry run mode will do everything as usual except commands execution
    -q, --quiet             Turn off chat and some logs in stdout
    -h, --help              output usage information
```
### get
Get specific cloudflare configuration from all zones
```
node bin/cloudflare/get --help

  Usage: get --zones <list|all> 

  Get specific cloudflare configuration from all zones

  Options:

    -z, --zones <list|all>  [required] Comma-separated list of cloudflare zone aliases. Available: dopamine-gaming.com,rtggib.cash,tgp.cash,redtiger.cash,m-gservices.com,redtiger-demo.com Available: dopamine-gaming.com,rtggib.cash,tgp.cash,redtiger.cash,m-gservices.com,redtiger-demo.com
    -u, --url <string>      Cloudflare url without the zone part (default: settings/security_level)
    -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose           Turn ON log details of whats happening
    -f, --force             Suppress confirm messages (used for automation)
    -n, --dry-run           Dry run mode will do everything as usual except commands execution
    -q, --quiet             Turn off chat and some logs in stdout
    -h, --help              output usage information
```
### unify-page-rules
Unifying cloudflare page rules
```
node bin/cloudflare/unify-page-rules --help

  Usage: unify-page-rules --zones <list|all> 

  Unifying cloudflare page rules

  Options:

    -z, --zones <list|all>  [required] Comma-separated list of cloudflare zone aliases. Available: dopamine-gaming.com,rtggib.cash,tgp.cash,redtiger.cash,m-gservices.com,redtiger-demo.com Available: dopamine-gaming.com,rtggib.cash,tgp.cash,redtiger.cash,m-gservices.com,redtiger-demo.com
    -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose           Turn ON log details of whats happening
    -f, --force             Suppress confirm messages (used for automation)
    -n, --dry-run           Dry run mode will do everything as usual except commands execution
    -q, --quiet             Turn off chat and some logs in stdout
    -h, --help              output usage information
```
### unify-pages
Unifying cloudflare custom pages
```
node bin/cloudflare/unify-pages --help

  Usage: unify-pages --zones <list|all> 

  Unifying cloudflare custom pages

  Options:

    -z, --zones <list|all>  [required] Comma-separated list of cloudflare zone aliases. Available: dopamine-gaming.com,rtggib.cash,tgp.cash,redtiger.cash,m-gservices.com,redtiger-demo.com Available: dopamine-gaming.com,rtggib.cash,tgp.cash,redtiger.cash,m-gservices.com,redtiger-demo.com
    -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose           Turn ON log details of whats happening
    -f, --force             Suppress confirm messages (used for automation)
    -n, --dry-run           Dry run mode will do everything as usual except commands execution
    -q, --quiet             Turn off chat and some logs in stdout
    -h, --help              output usage information
```
### unify-settings
Unifying cloudflare custom settings
```
node bin/cloudflare/unify-settings --help

  Usage: unify-settings --zones <list|all> 

  Unifying cloudflare custom settings

  Options:

    -z, --zones <list|all>  [required] Comma-separated list of cloudflare zone aliases. Available: dopamine-gaming.com,rtggib.cash,tgp.cash,redtiger.cash,m-gservices.com,redtiger-demo.com Available: dopamine-gaming.com,rtggib.cash,tgp.cash,redtiger.cash,m-gservices.com,redtiger-demo.com
    -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose           Turn ON log details of whats happening
    -f, --force             Suppress confirm messages (used for automation)
    -n, --dry-run           Dry run mode will do everything as usual except commands execution
    -q, --quiet             Turn off chat and some logs in stdout
    -h, --help              output usage information
```
