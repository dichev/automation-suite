## Available programs:

* **[dns](#dns)**
    * **[check](#dns-check)** - check are all host names resolved from current machine
    * **[update](#dns-update)** - auto sync dns records for all host names in to the office DNS server.
* **[templates](#templates)**
    * **[generate-hermes-config](#templates-generate-hermes-config)** - generate SQL migrations by location
    * **[generate-migrations](#templates-generate-migrations)** - generate SQL migrations by location
    * **[generate-new-operator](#templates-generate-new-operator)** - generate all configurations for new operator deployment
    * **[generate-servers-conf](#templates-generate-servers-conf)** - generate server-conf for specific location

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
    --dry-run               Dry run mode will do everything as usual except commands execution
    --quiet                 Turn off chat and some logs in stdout
    --wait <int>            Pause between iterations in seconds
    --announce              Announce what and why is happening and delay the execution to give time to all to prepare
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
    --dry-run               Dry run mode will do everything as usual except commands execution
    --quiet                 Turn off chat and some logs in stdout
    --wait <int>            Pause between iterations in seconds
    --announce              Announce what and why is happening and delay the execution to give time to all to prepare
    --no-chat               Disable chat notification if they are activated
    -h, --help              output usage information
```
## <a name="templates"></a>templates
### <a name="templates-generate-migrations"></a>generate-migrations
Generate SQL migrations by location
```
  Usage: node office/templates/generate-migrations [options]

  Generate SQL migrations by location

  Options:
    -t, --template <path>   Path to handlebars template (default: /d/www/servers/template-generator/templates/migrations/migration.sql.hbs)
    -d, --dest <path>       Output generated data to destination path (could be handlebars template)

  Additional Options:
    -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose           Turn ON log details of whats happening
    -f, --force             Suppress confirm messages (used for automation)
    --dry-run               Dry run mode will do everything as usual except commands execution
    --quiet                 Turn off chat and some logs in stdout
    --wait <int>            Pause between iterations in seconds
    --announce              Announce what and why is happening and delay the execution to give time to all to prepare
    --no-chat               Disable chat notification if they are activated
    -h, --help              output usage information
```
### <a name="templates-generate-new-operator"></a>generate-new-operator
Generate all configurations for new operator deployment
```
  Usage: node office/templates/generate-new-operator --operator <name> 

  Generate all configurations for new operator deployment

  Options:
    -o, --operator <name>   [required] The operator name, stored in conifg file
    -d, --dest <path>       Output generated data to destination path (could be handlebars template)
    --no-refresh-masters    Skip ensuring the masters are at expected revision

  Additional Options:
    -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose           Turn ON log details of whats happening
    -f, --force             Suppress confirm messages (used for automation)
    --dry-run               Dry run mode will do everything as usual except commands execution
    --quiet                 Turn off chat and some logs in stdout
    --wait <int>            Pause between iterations in seconds
    --announce              Announce what and why is happening and delay the execution to give time to all to prepare
    --no-chat               Disable chat notification if they are activated
    -h, --help              output usage information
```
### <a name="templates-generate-servers-conf"></a>generate-servers-conf
Generate server-conf for specific location
```
  Usage: node office/templates/generate-servers-conf --locations <list|all> 

  Generate server-conf for specific location

  Options:
    -l, --locations <list|all>  [required] The target host name
    -d, --dest <path>           Output generated data to destination path (could be handlebars template)
    --commit <msg>              Attempt to commit generate files

  Additional Options:
    -p, --parallel [limit]      When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose               Turn ON log details of whats happening
    -f, --force                 Suppress confirm messages (used for automation)
    --dry-run                   Dry run mode will do everything as usual except commands execution
    --quiet                     Turn off chat and some logs in stdout
    --wait <int>                Pause between iterations in seconds
    --announce                  Announce what and why is happening and delay the execution to give time to all to prepare
    --no-chat                   Disable chat notification if they are activated
    -h, --help                  output usage information
```
