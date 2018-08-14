# monitoring
### check
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
### update
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
