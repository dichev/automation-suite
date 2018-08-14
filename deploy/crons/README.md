# crons
### fetch
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
### update
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
