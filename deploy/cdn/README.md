# cdn
### cachebust
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
### check
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
### update
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
### version
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
