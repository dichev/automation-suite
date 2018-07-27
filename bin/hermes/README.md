# hermes
### allow-panel-access
```
node bin/hermes/allow-panel-access --help

Usage: allow-panel-access [options]

  Checking current cloudflare configuration

  Options:

    -p, --parallel [limit]      When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose               Turn ON log details of whats happening
    -f, --force                 Suppress confirm messages (used for automation)
    -n, --dry-run               Dry run mode will do everything as usual except commands execution
    -q, --quiet                 Turn off chat and some logs in stdout
    -V, --version               output the version number
    -o, --operators &lt;list|all&gt;  [required] Comma-separated list of operators. Available: rtg,bots,approv,betconstruct,bede,betfairmars,igc,kindred,matchbook,plaingaming,paddymars,rank,techsson,ugseu,videoslots,leovegas,mrgreen,sunbingo,pomadorro,pinnacle,marketing15,coingaming,williamhill,gvc,pop,gamesys,nektan,138global,aggfun,ugs2,ugs4,ugs3,ugs1,pokerstars Available: rtg,bots,approv,betconstruct,bede,betfairmars,igc,kindred,matchbook,plaingaming,paddymars,rank,techsson,ugseu,videoslots,leovegas,mrgreen,sunbingo,pomadorro,pinnacle,marketing15,coingaming,williamhill,gvc,pop,gamesys,nektan,138global,aggfun,ugs2,ugs4,ugs3,ugs1,pokerstars
    -m, --minutes &lt;int&gt;         Expire after defined minutes (default: 15)
    -r, --role &lt;string&gt;         Define admin role Available: RT_QAPROD,EXT_Marketing (default: RT_QAPROD)
    -h, --help                  output usage information
```
### check
```
node bin/hermes/check --help

Usage: check [options]

  Checking current cloudflare configuration

  Options:

    -p, --parallel [limit]      When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose               Turn ON log details of whats happening
    -f, --force                 Suppress confirm messages (used for automation)
    -n, --dry-run               Dry run mode will do everything as usual except commands execution
    -q, --quiet                 Turn off chat and some logs in stdout
    -V, --version               output the version number
    -o, --operators &lt;list|all&gt;  [required] Comma-separated list of operators. Available: rtg,bots,approv,betconstruct,bede,betfairmars,igc,kindred,matchbook,plaingaming,paddymars,rank,techsson,ugseu,videoslots,leovegas,mrgreen,sunbingo,pomadorro,pinnacle,marketing15,coingaming,williamhill,gvc,pop,gamesys,nektan,138global,aggfun,ugs2,ugs4,ugs3,ugs1,pokerstars Available: rtg,bots,approv,betconstruct,bede,betfairmars,igc,kindred,matchbook,plaingaming,paddymars,rank,techsson,ugseu,videoslots,leovegas,mrgreen,sunbingo,pomadorro,pinnacle,marketing15,coingaming,williamhill,gvc,pop,gamesys,nektan,138global,aggfun,ugs2,ugs4,ugs3,ugs1,pokerstars
    -r, --revision &lt;string&gt;     Target revision (like r.3.9.9.0) or from..to revision (like r3.9.9.0..r3.9.9.1)
    -h, --help                  output usage information
```
### update
```
node bin/hermes/update --help

Usage: update [options]

  Checking current cloudflare configuration

  Options:

    -p, --parallel [limit]      When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose               Turn ON log details of whats happening
    -f, --force                 Suppress confirm messages (used for automation)
    -n, --dry-run               Dry run mode will do everything as usual except commands execution
    -q, --quiet                 Turn off chat and some logs in stdout
    -V, --version               output the version number
    -o, --operators &lt;list|all&gt;  [required] Comma-separated list of operators. Available: rtg,bots,approv,betconstruct,bede,betfairmars,igc,kindred,matchbook,plaingaming,paddymars,rank,techsson,ugseu,videoslots,leovegas,mrgreen,sunbingo,pomadorro,pinnacle,marketing15,coingaming,williamhill,gvc,pop,gamesys,nektan,138global,aggfun,ugs2,ugs4,ugs3,ugs1,pokerstars Available: rtg,bots,approv,betconstruct,bede,betfairmars,igc,kindred,matchbook,plaingaming,paddymars,rank,techsson,ugseu,videoslots,leovegas,mrgreen,sunbingo,pomadorro,pinnacle,marketing15,coingaming,williamhill,gvc,pop,gamesys,nektan,138global,aggfun,ugs2,ugs4,ugs3,ugs1,pokerstars
    -r, --revision &lt;string&gt;     [required] Target revision (like r.3.9.9.0) or from..to revision (like r3.9.9.0..r3.9.9.1)
    -a, --allow-panel           Allow QA access to GPanel
    -h, --help                  output usage information
```
### version
```
node bin/hermes/version --help

Usage: version [options]

  Checking current cloudflare configuration

  Options:

    -p, --parallel [limit]      When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose               Turn ON log details of whats happening
    -f, --force                 Suppress confirm messages (used for automation)
    -n, --dry-run               Dry run mode will do everything as usual except commands execution
    -q, --quiet                 Turn off chat and some logs in stdout
    -V, --version               output the version number
    -o, --operators &lt;list|all&gt;  [required] Comma-separated list of operators. Available: rtg,bots,approv,betconstruct,bede,betfairmars,igc,kindred,matchbook,plaingaming,paddymars,rank,techsson,ugseu,videoslots,leovegas,mrgreen,sunbingo,pomadorro,pinnacle,marketing15,coingaming,williamhill,gvc,pop,gamesys,nektan,138global,aggfun,ugs2,ugs4,ugs3,ugs1,pokerstars Available: rtg,bots,approv,betconstruct,bede,betfairmars,igc,kindred,matchbook,plaingaming,paddymars,rank,techsson,ugseu,videoslots,leovegas,mrgreen,sunbingo,pomadorro,pinnacle,marketing15,coingaming,williamhill,gvc,pop,gamesys,nektan,138global,aggfun,ugs2,ugs4,ugs3,ugs1,pokerstars
    -h, --help                  output usage information
```
