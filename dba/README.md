## Available programs:

* **[fetch](#fetch)**
    * **[query](#fetch-query)** - fetch anything from operator database replications
* **[migrations](#migrations)**
    * **[history-sync-pending-rounds](#migrations-history-sync-pending-rounds)** 
    * **[optimize-table](#migrations-optimize-table)** - optimize table fragmentation by rebuilding it online
    * **[percona-online-schema-change](#migrations-percona-online-schema-change)** - alters a table&#x27;s structure without blocking reads or writes (will copy all rows)
    * **[sync-betlimits](#migrations-sync-betlimits)** - sync operator bet limits without betlimits downtime
    * **[sync-games](#migrations-sync-games)** - sync games and maths seeds
    * **[update-users-country](#migrations-update-users-country)** - update users country using ip geolocation. This is very expensive migration, that&#x27;s why is executed ..

## Help
## <a name="fetch"></a>fetch
### <a name="fetch-query"></a>query
Fetch anything from operator database replications
```
  Usage: node dba/fetch/query --query <sql> --operators <name> 

Fetch anything from operator database replications

Options:
  -q, --query <sql>       [required] Read-only SQL query
  -o, --operators <name>  [required] The target operator name
  --db <type>             The target database type

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
## <a name="migrations"></a>migrations
### <a name="migrations-history-sync-pending-rounds"></a>history-sync-pending-rounds

```
  Usage: node dba/migrations/history-sync-pending-rounds --operators <name> 

Options:
  -o, --operators <name>  [required] The target operator name

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
### <a name="migrations-optimize-table"></a>optimize-table
Optimize table fragmentation by rebuilding it online
```
  Usage: node dba/migrations/optimize-table --operators <name> --tables <name> --db <type> 

Optimize table fragmentation by rebuilding it online

Options:
  -o, --operators <name>  [required] The target operator name
  -t, --tables <name>     [required] The table names (comma separated)
  --db <type>             [required] The target database type

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
### <a name="migrations-percona-online-schema-change"></a>percona-online-schema-change
Alters a table&#x27;s structure without blocking reads or writes (will copy all rows)
```
  Usage: node dba/migrations/percona-online-schema-change --operators <name> --table <name> --db <type> 

Alters a table's structure without blocking reads or writes (will copy all rows)

Options:
  -o, --operators <name>  [required] The target operator name
  -t, --table <name>      [required] The table name
  --alter <sql>           The schema modification, without the ALTER TABLE keywords
  --alter-file <file>     File containing the schema modification, without the ALTER TABLE keywords
  --db <type>             [required] The target database type

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

  Example usage:
    $  node dba/migrations/percona-online-schema-change -o rtg --db platform --table __version --alter 'CHANGE COLUMN version version INT(10) UNSIGNED NOT NULL AFTER id' --dry-run
    $  node dba/migrations/percona-online-schema-change -o rtg --db platform --table __version --alter-file single-alter-migration.sql
```
### <a name="migrations-sync-betlimits"></a>sync-betlimits
Sync operator bet limits without betlimits downtime
```
  Usage: node dba/migrations/sync-betlimits --operators <name> 

Sync operator bet limits without betlimits downtime

Options:
  -o, --operators <name>  [required] The target operator name
  --rollback              Will restore the previous state of the bet limits. In case of production errors this is the fastest route

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
### <a name="migrations-sync-games"></a>sync-games
Sync games and maths seeds
```
  Usage: node dba/migrations/sync-games --operators <name> 

Sync games and maths seeds

Options:
  -o, --operators <name>  [required] The target operator name
  -r, --rev <name>        The target revision or tag name. Useful for rollback

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
### <a name="migrations-update-users-country"></a>update-users-country
Update users country using ip geolocation. This is very expensive migration, that&#x27;s why is executed in a loop user by user
```
  Usage: node dba/migrations/update-users-country --operators <name> 

Update users country using ip geolocation. This is very expensive migration, that's why is executed in a loop user by user

Options:
  -o, --operators <name>  [required] The target operator name
  --chunk-size <int>      How many user to be calculated together (default: 20)

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
