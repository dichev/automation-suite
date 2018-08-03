## Available programs:

* **[migrations](#migrations)**
    * **[update-users-country](#migrations-update-users-country)** - update users country using ip geolocation. This is very expensive migration, that&#x27;s why is executed ..

## Help
## <a name="migrations"></a>migrations
### <a name="migrations-update-users-country"></a>update-users-country
Update users country using ip geolocation. This is very expensive migration, that&#x27;s why is executed in a loop user by user
```
  Usage: node db/migrations/update-users-country --operators <name> 

  Update users country using ip geolocation. This is very expensive migration, that's why is executed in a loop user by user

  Options:
    -o, --operators <name>  [required] The target operator name. Available: rtg,bots,approv,betconstruct,bede,betfairmars,igc,kindred,matchbook,plaingaming,paddymars,rank,techsson,ugseu,videoslots,leovegas,mrgreen,sunbingo,pomadorro,pinnacle,marketing15,coingaming,soft2bet,williamhill,gvc,pop,gamesys,nektan,138global,aggfun,ugs2,ugs4,ugs3,ugs1,pokerstars

  Additional Options:
    -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose           Turn ON log details of whats happening
    -f, --force             Suppress confirm messages (used for automation)
    -n, --dry-run           Dry run mode will do everything as usual except commands execution
    -q, --quiet             Turn off chat and some logs in stdout
    --no-chat               Disable chat notification if they are activated
    -h, --help              output usage information
```
