# hermes
### 
Allow QA access to gpanel
```
node bin/hermes/allow-panel-access --help

  Usage: allow-panel-access --operators <list|all> 

  Allow QA access to gpanel

  Options:

    -o, --operators <list|all>  [required] Comma-separated list of operators. Available: rtg,bots,approv,betconstruct,bede,betfairmars,igc,kindred,matchbook,plaingaming,paddymars,rank,techsson,ugseu,videoslots,leovegas,mrgreen,sunbingo,pomadorro,pinnacle,marketing15,coingaming,williamhill,gvc,pop,gamesys,nektan,138global,aggfun,ugs2,ugs4,ugs3,ugs1,pokerstars Available: rtg,bots,approv,betconstruct,bede,betfairmars,igc,kindred,matchbook,plaingaming,paddymars,rank,techsson,ugseu,videoslots,leovegas,mrgreen,sunbingo,pomadorro,pinnacle,marketing15,coingaming,williamhill,gvc,pop,gamesys,nektan,138global,aggfun,ugs2,ugs4,ugs3,ugs1,pokerstars
    -m, --minutes <int>         Expire after defined minutes (default: 15)
    -r, --role <string>         Define admin role Available: RT_QAPROD,EXT_Marketing (default: RT_QAPROD)
    -p, --parallel [limit]      When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose               Turn ON log details of whats happening
    -f, --force                 Suppress confirm messages (used for automation)
    -n, --dry-run               Dry run mode will do everything as usual except commands execution
    -q, --quiet                 Turn off chat and some logs in stdout
    -h, --help                  output usage information
```
### 
Pre-deployment tests
```
node bin/hermes/check --help

  Usage: check --operators <list|all> 

  Pre-deployment tests

  Options:

    -o, --operators <list|all>  [required] Comma-separated list of operators. Available: rtg,bots,approv,betconstruct,bede,betfairmars,igc,kindred,matchbook,plaingaming,paddymars,rank,techsson,ugseu,videoslots,leovegas,mrgreen,sunbingo,pomadorro,pinnacle,marketing15,coingaming,williamhill,gvc,pop,gamesys,nektan,138global,aggfun,ugs2,ugs4,ugs3,ugs1,pokerstars Available: rtg,bots,approv,betconstruct,bede,betfairmars,igc,kindred,matchbook,plaingaming,paddymars,rank,techsson,ugseu,videoslots,leovegas,mrgreen,sunbingo,pomadorro,pinnacle,marketing15,coingaming,williamhill,gvc,pop,gamesys,nektan,138global,aggfun,ugs2,ugs4,ugs3,ugs1,pokerstars
    -r, --revision <string>     Target revision (like r.3.9.9.01) or from..to revision (like r3.9.9.0..r3.9.9.1)
    -p, --parallel [limit]      When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose               Turn ON log details of whats happening
    -f, --force                 Suppress confirm messages (used for automation)
    -n, --dry-run               Dry run mode will do everything as usual except commands execution
    -q, --quiet                 Turn off chat and some logs in stdout
    -h, --help                  output usage information

  Example usage:

    node bin/hermes/check --operators all -p 10
    node bin/hermes/check -o bots,rtg
    node bin/hermes/check -o bots -r r3.9.9.1
    node bin/hermes/check -o bots -r r3.9.9.0..r3.9.9.1
```
### 
Direct update of hermes release version
```
node bin/hermes/update --help

  Usage: update --operators <list|all> --revision <string> 

  Direct update of hermes release version

  Options:

    -o, --operators <list|all>  [required] Comma-separated list of operators. Available: rtg,bots,approv,betconstruct,bede,betfairmars,igc,kindred,matchbook,plaingaming,paddymars,rank,techsson,ugseu,videoslots,leovegas,mrgreen,sunbingo,pomadorro,pinnacle,marketing15,coingaming,williamhill,gvc,pop,gamesys,nektan,138global,aggfun,ugs2,ugs4,ugs3,ugs1,pokerstars Available: rtg,bots,approv,betconstruct,bede,betfairmars,igc,kindred,matchbook,plaingaming,paddymars,rank,techsson,ugseu,videoslots,leovegas,mrgreen,sunbingo,pomadorro,pinnacle,marketing15,coingaming,williamhill,gvc,pop,gamesys,nektan,138global,aggfun,ugs2,ugs4,ugs3,ugs1,pokerstars
    -r, --revision <string>     [required] Target revision (like r.3.9.9.0) or from..to revision (like r3.9.9.0..r3.9.9.1)
    -a, --allow-panel           Allow QA access to GPanel
    -p, --parallel [limit]      When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose               Turn ON log details of whats happening
    -f, --force                 Suppress confirm messages (used for automation)
    -n, --dry-run               Dry run mode will do everything as usual except commands execution
    -q, --quiet                 Turn off chat and some logs in stdout
    -h, --help                  output usage information
```
### 
Check current hermes release versions
```
node bin/hermes/version --help

  Usage: version --operators <list|all> 

  Check current hermes release versions

  Options:

    -o, --operators <list|all>  [required] Comma-separated list of operators. Available: rtg,bots,approv,betconstruct,bede,betfairmars,igc,kindred,matchbook,plaingaming,paddymars,rank,techsson,ugseu,videoslots,leovegas,mrgreen,sunbingo,pomadorro,pinnacle,marketing15,coingaming,williamhill,gvc,pop,gamesys,nektan,138global,aggfun,ugs2,ugs4,ugs3,ugs1,pokerstars Available: rtg,bots,approv,betconstruct,bede,betfairmars,igc,kindred,matchbook,plaingaming,paddymars,rank,techsson,ugseu,videoslots,leovegas,mrgreen,sunbingo,pomadorro,pinnacle,marketing15,coingaming,williamhill,gvc,pop,gamesys,nektan,138global,aggfun,ugs2,ugs4,ugs3,ugs1,pokerstars
    -p, --parallel [limit]      When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose               Turn ON log details of whats happening
    -f, --force                 Suppress confirm messages (used for automation)
    -n, --dry-run               Dry run mode will do everything as usual except commands execution
    -q, --quiet                 Turn off chat and some logs in stdout
    -h, --help                  output usage information
```
