# docs
### 
Auto-generate README files with commands help
```
node bin/docs/generate --help


  Usage: generate [options]

  Auto-generate README files with commands help

  Options:

    -p, --parallel [limit]  When run with multiple hosts define how many commands to be executed in parallel. Set to 0 execute them all together. By default will be executed sequentially
    -v, --verbose           Turn ON log details of whats happening
    -f, --force             Suppress confirm messages (used for automation)
    -n, --dry-run           Dry run mode will do everything as usual except commands execution
    -q, --quiet             Turn off chat and some logs in stdout
    -h, --help              output usage information
```
