## Available programs:


* **[generate-docs](#BASE-generate-docs)** - auto-generate README files with commands help
* **[generate-migrations](#BASE-generate-migrations)** - generate SQL migrations by location
* **[generate-new-operator](#BASE-generate-new-operator)** - generate all configurations for new operator deployment
* **[generate-prometheus-conf](#BASE-generate-prometheus-conf)** - generate prometheus config specific location
* **[generate-pyxbackup](#BASE-generate-pyxbackup)** - generate pyxbackup config specific location
* **[generate-servers-conf](#BASE-generate-servers-conf)** - generate server-conf for specific location

## Help

### <a name="BASE-generate-docs"></a>generate-docs
Auto-generate README files with commands help
```
Usage: node generators/generate-docs --groups <list|all> 

Auto-generate README files with commands help

Options:
  -g, --groups <list|all>  [required] The target commands groups. Available: 
                           deploy, servers, generators, office, dba

Additional Options: (see global options)
```
### <a name="BASE-generate-migrations"></a>generate-migrations
Generate SQL migrations by location
```
Usage: node generators/generate-migrations [options]

Generate SQL migrations by location

Options:
  -t, --template <path>   Path to handlebars template (default: 
                          "D:/www/dopamine/devops/automation-cleaned/generators/templates/migrations/migration.sql.hbs")
  -d, --dest <path>       Output generated data to destination path (could be 
                          handlebars template)

Additional Options: (see global options)
```
### <a name="BASE-generate-new-operator"></a>generate-new-operator
Generate all configurations for new operator deployment
```
Usage: node generators/generate-new-operator --operator <name> 

Generate all configurations for new operator deployment

Options:
  -o, --operator <name>   [required] The operator name, stored in conifg file. 
                          Available: bots, dope, islandluck, approv, 
                          betconstruct, bede, igc, kindredgroup, matchbook, 
                          plaingaming, rank, techsson, playfortuna, videoslots, 
                          leovegas (.. 126 more)
  -d, --dest <path>       Output generated data to destination path (could be 
                          handlebars template)
  --no-refresh-masters    Skip ensuring the masters are at expected revision

Additional Options: (see global options)
```
### <a name="BASE-generate-prometheus-conf"></a>generate-prometheus-conf
Generate prometheus config specific location
```
Usage: node generators/generate-prometheus-conf [options]

Generate prometheus config specific location

Options:

Additional Options: (see global options)
```
### <a name="BASE-generate-pyxbackup"></a>generate-pyxbackup
Generate pyxbackup config specific location
```
Usage: node generators/generate-pyxbackup --hosts <list|all> 

Generate pyxbackup config specific location

Options:
  -h, --hosts <list|all>  [required] The target host names. Available: 
                          belgium-sandbox-math1, belgium-sandbox-math2, 
                          belgium-sandbox-bots1, belgium-sandbox-bots2, 
                          belgium-sandbox-lb1, belgium-sandbox-mariadb-master1, 
                          belgium-sandbox-mariadb-slave1, 
                          belgium-sandbox-db-archive, belgium-sandbox-web1, 
                          belgium-sandbox-web2, belgium-sandbox-web3, 
                          belgium-mga-db-exalogic-db1-master1, 
                          belgium-mga-exalogic-wspgda1-web1, 
                          belgium-mga-mariadb-jackpots-master1, 
                          belgium-mga-mariadb-jackpots-slave1 (.. 163 more)
  -f, --force             Skip manual changes validations and proceed on your 
                          risk

Additional Options: (see global options)
```
### <a name="BASE-generate-servers-conf"></a>generate-servers-conf
Generate server-conf for specific location
```
Usage: node generators/generate-servers-conf --locations <list|all> 

Generate server-conf for specific location

Options:
  -l, --locations <list|all>  [required] The target location. Available: dev, 
                              belgium-sandbox, belgium-alderney, belgium-other, 
                              rockolo, taiwan, belgium-mga, bahamas
  -d, --dest <path>           Output generated data to destination path (could 
                              be handlebars template)
  --commit [msg]              Attempt to commit generate files

Additional Options: (see global options)
```
