## Available programs:

* **[fetch](#fetch)**
    * **[diff-schema](#fetch-diff-schema)** - compare database schemas of the operators
    * **[diff-seed](#fetch-diff-seed)** - compare database seed of the operators
    * **[query](#fetch-query)** - fetch anything from operator database replications
    * **[table-size](#fetch-table-size)** - fetch anything from operator database replications
* **[migrations](#migrations)**
    * **[sync-history-pending-rounds](#migrations-sync-history-pending-rounds)** 
    * **[update-users-country](#migrations-update-users-country)** - update users country using ip geolocation. This is very expensive migration, that&#x27;s why is executed ..
    * **[update-users-game-config-id](#migrations-update-users-game-config-id)** 
* **[utils](#utils)**
    * **[gtid-migrations-simplified](#utils-gtid-migrations-simplified)** - migrate to GTID
    * **[operations-by-location](#utils-operations-by-location)** - migrated Operator settings
    * **[optimize-table](#utils-optimize-table)** - optimize table fragmentation by rebuilding it online
    * **[percona-online-schema-change](#utils-percona-online-schema-change)** - alters a table&#x27;s structure without blocking reads or writes (will copy all rows)

## Help
## <a name="fetch"></a>fetch
### <a name="fetch-diff-schema"></a>diff-schema
Compare database schemas of the operators
```
Usage: node dba/fetch/diff-schema --operators <name> 

Compare database schemas of the operators

Options:
  -o, --operators <name>  [required] The target operator name
  --base <operator>       The operator which database will be used as base for the comparison. By default will be used the first one from the --operators list

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
### <a name="fetch-diff-seed"></a>diff-seed
Compare database seed of the operators
```
Usage: node dba/fetch/diff-seed --operators <name> 

Compare database seed of the operators

Options:
  -o, --operators <name>  [required] The target operator name
  --base <operator>       The operator which database will be used as base for the comparison. By default will be used the first one from the --operators list

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
### <a name="fetch-query"></a>query
Fetch anything from operator database replications
```
Usage: node dba/fetch/query --operators <name> 

Fetch anything from operator database replications

Options:
  -q, --query <sql>       Read-only SQL query
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
### <a name="fetch-table-size"></a>table-size
Fetch anything from operator database replications
```
Usage: node dba/fetch/table-size --tables <list> --operators <name> 

Fetch anything from operator database replications

Options:
  -t, --tables <list>     [required] Comma separated list of tables
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
## <a name="mariadb"></a>mariadb
## <a name="migrations"></a>migrations
### <a name="migrations-sync-history-pending-rounds"></a>sync-history-pending-rounds

```
Usage: node dba/migrations/sync-history-pending-rounds --operators <name> 

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
### <a name="migrations-update-users-game-config-id"></a>update-users-game-config-id

```
Usage: node dba/migrations/update-users-game-config-id --operators <name> 

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
## <a name="utils"></a>utils
### <a name="utils-gtid-migrations-simplified"></a>gtid-migrations-simplified
Migrate to GTID
```
Usage: node dba/utils/gtid-migrations-simplified --databases <name> --group <name> 

Migrate to GTID

Options:
  -d, --databases <name>  [required] Target database from Configurator.databases
  -g, --group <name>      [required]  Target cluster group [master,archive]

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
### <a name="utils-operations-by-location"></a>operations-by-location
Migrated Operator settings
```
Usage: node dba/utils/operations-by-location --locations <name> 

Migrated Operator settings

Options:
  -l, --locations <name>  [required] targetLocation

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
### <a name="utils-optimize-table"></a>optimize-table
Optimize table fragmentation by rebuilding it online
```
Usage: node dba/utils/optimize-table --operators <name> --tables <name> --db <type> 

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
### <a name="utils-percona-online-schema-change"></a>percona-online-schema-change
Alters a table&#x27;s structure without blocking reads or writes (will copy all rows)
```
Usage: node dba/utils/percona-online-schema-change --operators <name> --table <name> --db <type> 

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
