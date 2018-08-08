## Available programs:

* **[dns](#dns)**
    * **[check](#dns-check)** - check are all host names resolved from current machine
    * **[update](#dns-update)** - auto sync dns records for all host names in to the office DNS server.

## Help
## <a name="dns"></a>dns
### <a name="dns-check"></a>check
Check are all host names resolved from current machine
```
  Usage: node office/dns/check [options]

  Check are all host names resolved from current machine

  Options:

  Additional Options:
    -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose           Turn ON log details of whats happening
    -f, --force             Suppress confirm messages (used for automation)
    -n, --dry-run           Dry run mode will do everything as usual except commands execution
    -q, --quiet             Turn off chat and some logs in stdout
    --no-chat               Disable chat notification if they are activated
    -h, --help              output usage information
```
### <a name="dns-update"></a>update
Auto sync dns records for all host names in to the office DNS server.
```
  Usage: node office/dns/update [options]

  Auto sync dns records for all host names in to the office DNS server.

  Options:

  Additional Options:
    -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose           Turn ON log details of whats happening
    -f, --force             Suppress confirm messages (used for automation)
    -n, --dry-run           Dry run mode will do everything as usual except commands execution
    -q, --quiet             Turn off chat and some logs in stdout
    --no-chat               Disable chat notification if they are activated
    -h, --help              output usage information
```
