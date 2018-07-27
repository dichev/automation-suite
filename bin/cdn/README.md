# cdn
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
