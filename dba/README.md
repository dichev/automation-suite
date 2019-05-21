## Available programs:

* **[fetch](#fetch)**
    * **[diff-schema](#fetch-diff-schema)** - compare database schemas of the operators
    * **[diff-seed](#fetch-diff-seed)** - compare database seed of the operators
    * **[query-by-host](#fetch-query-by-host)** - fetch anything from any replication
    * **[query](#fetch-query)** - fetch anything from operator database replications
    * **[table-size](#fetch-table-size)** - fetch anything from operator database replications
* **[mariadb](#mariadb)**
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
  -o, --operators <name>  [required] The target operator name. Available: bots, 
                          dope, islandluck, approv, betconstruct, bede, igc, 
                          kindredgroup, matchbook, plaingaming, rank, techsson, 
                          playfortuna, videoslots, leovegas (.. 126 more)
  --base <operator>       The operator which database will be used as base for 
                          the comparison. By default will be used the first one 
                          from the --operators list
  --db <list>             List of database types to be validated. By default 
                          will check them all. Available: platform, demo, 
                          panel, jackpot, stats, segments, tournaments, bonus, 
                          archive

Additional Options: (see global options)
```
### <a name="fetch-diff-seed"></a>diff-seed
Compare database seed of the operators
```
Usage: node dba/fetch/diff-seed --operators <name> 

Compare database seed of the operators

Options:
  -o, --operators <name>  [required] The target operator name. Available: bots, 
                          dope, islandluck, approv, betconstruct, bede, igc, 
                          kindredgroup, matchbook, plaingaming, rank, techsson, 
                          playfortuna, videoslots, leovegas (.. 126 more)
  --base <operator>       The operator which database will be used as base for 
                          the comparison. By default will be used the first one 
                          from the --operators list

Additional Options: (see global options)
```
### <a name="fetch-query-by-host"></a>query-by-host
Fetch anything from any replication
```
Usage: node dba/fetch/query-by-host --hosts <name|all> 

Fetch anything from any replication

Options:
  -q, --query <sql>       Read-only SQL query
  -h, --hosts <name|all>  [required] The target database instances. Available: 
                          sofia-replication-belgium-sandbox-mariadb-master1, 
                          sofia-replication-belgium-sandbox-db-archive, 
                          sofia-replication-belgium-other-db-archive, 
                          sofia-replication-belgium-alderney-db-archive, 
                          sofia-replication-belgium-mga-db-archive, 
                          sofia-replication-belgium-mga-mariadb-jackpot1, 
                          sofia-replication-taiwan-db-archive2, 
                          sofia-replication-taiwan-db-archive1, 
                          sofia-replication-rockolo-db-archive, 
                          sofia-replication-bahamas-db-archive, 
                          sofia-replication-all-db-archive-cold, 
                          sofia-replication-belgium-alderney-mariadb-master1, 
                          sofia-replication-belgium-other-mariadb-master1, 
                          sofia-replication-belgium-mga-mariadb-master1, 
                          sofia-replication-belgium-mga-mariadb-master2 (.. 8 
                          more)

Additional Options: (see global options)
```
### <a name="fetch-query"></a>query
Fetch anything from operator database replications
```
Usage: node dba/fetch/query --operators <name> 

Fetch anything from operator database replications

Options:
  -q, --query <sql>       Read-only SQL query
  -o, --operators <name>  [required] The target operator name. Available: bots, 
                          dope, islandluck, approv, betconstruct, bede, igc, 
                          kindredgroup, matchbook, plaingaming, rank, techsson, 
                          playfortuna, videoslots, leovegas (.. 126 more)
  --db <type>             The target database type. Available: platform, demo, 
                          panel, bonus, segments, stats, jackpot, tournaments, 
                          archive (default: "platform")

Additional Options: (see global options)
```
### <a name="fetch-table-size"></a>table-size
Fetch anything from operator database replications
```
Usage: node dba/fetch/table-size --tables <list> --operators <name> 

Fetch anything from operator database replications

Options:
  -t, --tables <list>     [required] Comma separated list of tables
  -o, --operators <name>  [required] The target operator name. Available: bots, 
                          dope, islandluck, approv, betconstruct, bede, igc, 
                          kindredgroup, matchbook, plaingaming, rank, techsson, 
                          playfortuna, videoslots, leovegas (.. 126 more)
  --db <type>             The target database type. Available: platform, demo, 
                          panel, bonus, segments, stats, jackpot, tournaments, 
                          archive (default: "platform")

Additional Options: (see global options)
```
## <a name="mariadb"></a>mariadb
## <a name="migrations"></a>migrations
### <a name="migrations-sync-history-pending-rounds"></a>sync-history-pending-rounds

```
Usage: node dba/migrations/sync-history-pending-rounds --operators <name> 

Options:
  -o, --operators <name>  [required] The target operator name. Available: bots, 
                          dope, islandluck, approv, betconstruct, bede, igc, 
                          kindredgroup, matchbook, plaingaming, rank, techsson, 
                          playfortuna, videoslots, leovegas (.. 126 more)

Additional Options: (see global options)
```
### <a name="migrations-update-users-country"></a>update-users-country
Update users country using ip geolocation. This is very expensive migration, that&#x27;s why is executed in a loop user by user
```
Usage: node dba/migrations/update-users-country --operators <name> 

Update users country using ip geolocation. This is very expensive migration, that's why is executed in a loop user by user

Options:
  -o, --operators <name>  [required] The target operator name. Available: bots, 
                          dope, islandluck, approv, betconstruct, bede, igc, 
                          kindredgroup, matchbook, plaingaming, rank, techsson, 
                          playfortuna, videoslots, leovegas (.. 126 more)
  --chunk-size <int>      How many user to be calculated together (default: 20)

Additional Options: (see global options)
```
### <a name="migrations-update-users-game-config-id"></a>update-users-game-config-id

```
Usage: node dba/migrations/update-users-game-config-id --operators <name> 

Options:
  -o, --operators <name>  [required] The target operator name. Available: bots, 
                          dope, islandluck, approv, betconstruct, bede, igc, 
                          kindredgroup, matchbook, plaingaming, rank, techsson, 
                          playfortuna, videoslots, leovegas (.. 126 more)
  --chunk-size <int>      How many user to be calculated together (default: 20)

Additional Options: (see global options)
```
## <a name="utils"></a>utils
### <a name="utils-gtid-migrations-simplified"></a>gtid-migrations-simplified
Migrate to GTID
```
Usage: node dba/utils/gtid-migrations-simplified --databases <name> --group <name> 

Migrate to GTID

Options:
  -d, --databases <name>  [required] Target database from 
                          Configurator.databases. Available: dev-mariadb1, 
                          rockolo-mariadb1, taiwan-mariadb1, taiwan-mariadb2, 
                          belgium-sandbox-mariadb1, belgium-mga-mariadb1, 
                          belgium-mga-mariadb2, belgium-mga-mariadb3, 
                          belgium-mga-mariadb4, belgium-mga-mariadb5, 
                          belgium-mga-mariadb6, belgium-mga-mariadb7, 
                          belgium-alderney-mariadb1, belgium-other-mariadb1, 
                          bahamas-mariadb1
  -g, --group <name>      [required]  Target cluster group [master,archive]. 
                          Available: master, archive

Additional Options: (see global options)
```
### <a name="utils-operations-by-location"></a>operations-by-location
Migrated Operator settings
```
Usage: node dba/utils/operations-by-location --locations <name> 

Migrated Operator settings

Options:
  -l, --locations <name>  [required] targetLocation. Available: 
                          belgium-sandbox, belgium-mga, belgium-alderney, 
                          belgium-other, rockolo, taiwan, bahamas, malta, dev, 
                          storage, docker

Additional Options: (see global options)
```
### <a name="utils-optimize-table"></a>optimize-table
Optimize table fragmentation by rebuilding it online
```
Usage: node dba/utils/optimize-table --operators <name> --tables <name> --db <type> 

Optimize table fragmentation by rebuilding it online

Options:
  -o, --operators <name>  [required] The target operator name. Available: bots, 
                          dope, islandluck, approv, betconstruct, bede, igc, 
                          kindredgroup, matchbook, plaingaming, rank, techsson, 
                          playfortuna, videoslots, leovegas (.. 126 more)
  -t, --tables <name>     [required] The table names (comma separated)
  --db <type>             [required] The target database type. Available: 
                          platform, panel, bonus, segments, stats, jackpot, 
                          tournaments

Additional Options: (see global options)
```
### <a name="utils-percona-online-schema-change"></a>percona-online-schema-change
Alters a table&#x27;s structure without blocking reads or writes (will copy all rows)
```
Usage: node dba/utils/percona-online-schema-change --operators <name> --table <name> --db <type> 

Alters a table's structure without blocking reads or writes (will copy all rows)

Options:
  -o, --operators <name>  [required] The target operator name. Available: bots, 
                          dope, islandluck, approv, betconstruct, bede, igc, 
                          kindredgroup, matchbook, plaingaming, rank, techsson, 
                          playfortuna, videoslots, leovegas (.. 126 more)
  -t, --table <name>      [required] The table name
  --alter <sql>           The schema modification, without the ALTER TABLE 
                          keywords
  --alter-file <file>     File containing the schema modification, without the 
                          ALTER TABLE keywords
  --db <type>             [required] The target database type. Available: 
                          platform, panel, bonus (default: "platform")

Additional Options: (see global options)
```
