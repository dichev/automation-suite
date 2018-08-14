# hermes
### allow-panel-access
Allow QA access to gpanel
```
  Usage: node deploy/hermes/allow-panel-access --operators <list|all> 

  Allow QA access to gpanel

  Options:
    -o, --operators <list|all>  [required] Comma-separated list of operators. Available: rtg,bots,approv,betconstruct,bede,betfairmars,igc,kindred,matchbook,plaingaming,paddymars,rank,techsson,ugseu,videoslots,leovegas,mrgreen,sunbingo,pomadorro,pinnacle,marketing15,coingaming,soft2bet,williamhill,gvc,pop,gamesys,nektan,138global,pokerstars,aggfun,ugs2,ugs4,ugs3,ugs1
    -m, --minutes <int>         Expire after defined minutes (default: 15)
    -r, --role <string>         Define admin role. Available: RT_QAPROD,EXT_Marketing (default: RT_QAPROD)

  Additional Options:
    -p, --parallel [limit]      When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose               Turn ON log details of whats happening
    -f, --force                 Suppress confirm messages (used for automation)
    -n, --dry-run               Dry run mode will do everything as usual except commands execution
    -q, --quiet                 Turn off chat and some logs in stdout
    --no-chat                   Disable chat notification if they are activated
    -h, --help                  output usage information
```
### check
Pre-deployment tests
```
  Usage: node deploy/hermes/check --operators <list|all> 

  Pre-deployment tests

  Options:
    -o, --operators <list|all>  [required] Comma-separated list of operators. Available: rtg,bots,approv,betconstruct,bede,betfairmars,igc,kindred,matchbook,plaingaming,paddymars,rank,techsson,ugseu,videoslots,leovegas,mrgreen,sunbingo,pomadorro,pinnacle,marketing15,coingaming,soft2bet,williamhill,gvc,pop,gamesys,nektan,138global,pokerstars,aggfun,ugs2,ugs4,ugs3,ugs1
    -r, --rev <string>          Target revision (like r3.9.9.01) or from..to revision (like r3.9.9.0..r3.9.9.1)

  Additional Options:
    -p, --parallel [limit]      When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose               Turn ON log details of whats happening
    -f, --force                 Suppress confirm messages (used for automation)
    -n, --dry-run               Dry run mode will do everything as usual except commands execution
    -q, --quiet                 Turn off chat and some logs in stdout
    --no-chat                   Disable chat notification if they are activated
    -h, --help                  output usage information


  Example usage:
    node deploy/hermes/check --operators all -p 10
    node deploy/hermes/check -o bots,rtg
    node deploy/hermes/check -o bots -r r3.9.9.1
    node deploy/hermes/check -o bots -r r3.9.9.0..r3.9.9.1
```
### update
Direct update of hermes release version
```
  Usage: node deploy/hermes/update --operators <list|all> --rev <string> 

  Direct update of hermes release version

  Options:
    -o, --operators <list|all>          [required] Comma-separated list of operators. Available: rtg,bots,approv,betconstruct,bede,betfairmars,igc,kindred,matchbook,plaingaming,paddymars,rank,techsson,ugseu,videoslots,leovegas,mrgreen,sunbingo,pomadorro,pinnacle,marketing15,coingaming,soft2bet,williamhill,gvc,pop,gamesys,nektan,138global,pokerstars,aggfun,ugs2,ugs4,ugs3,ugs1
    -r, --rev <string>                  [required] Target revision (like r3.9.9.0) or from..to revision (like r3.9.9.0..r3.9.9.1)
    -s, --strategy <direct|blue-green>  Choose deployment strategy. Available: direct,blue-green (default: blue-green)
    --allow-panel                       Allow QA access to GPanel

  Additional Options:
    -p, --parallel [limit]              When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose                       Turn ON log details of whats happening
    -f, --force                         Suppress confirm messages (used for automation)
    -n, --dry-run                       Dry run mode will do everything as usual except commands execution
    -q, --quiet                         Turn off chat and some logs in stdout
    --no-chat                           Disable chat notification if they are activated
    -h, --help                          output usage information


  Example usage:
    node deploy/hermes/update --operators bots --rev r3.9.9.1 --strategy blue-green --allow-panel --force
```
### version
Check current hermes release versions
```
  Usage: node deploy/hermes/version --operators <list|all> 

  Check current hermes release versions

  Options:
    -o, --operators <list|all>  [required] Comma-separated list of operators. Available: rtg,bots,approv,betconstruct,bede,betfairmars,igc,kindred,matchbook,plaingaming,paddymars,rank,techsson,ugseu,videoslots,leovegas,mrgreen,sunbingo,pomadorro,pinnacle,marketing15,coingaming,soft2bet,williamhill,gvc,pop,gamesys,nektan,138global,pokerstars,aggfun,ugs2,ugs4,ugs3,ugs1

  Additional Options:
    -p, --parallel [limit]      When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose               Turn ON log details of whats happening
    -f, --force                 Suppress confirm messages (used for automation)
    -n, --dry-run               Dry run mode will do everything as usual except commands execution
    -q, --quiet                 Turn off chat and some logs in stdout
    --no-chat                   Disable chat notification if they are activated
    -h, --help                  output usage information


  Example usage:
    $ node deploy/hermes/version --operators all -p 10
```
