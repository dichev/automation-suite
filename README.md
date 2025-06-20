# Dopamine Automation
Contains all automation commands used by the DevOps team

### Usage
```bash
# first install dependencies
npm install

# then any command could be executed via node
node PATH/COMMAND [OPTIONS]

# examples
node docs/generate --groups all
node dba/migrations/optmize-table --operators all --table table1,table2,table3
node servers/cloudflare/check --zones all --parallel

```
The commands are organized in groups:
- [deploy](deploy/README.md) - all deployment commands
- [servers](servers/README.md) - server creation, unification and maintenance
- [dba](dba/README.md) - database specific commands, used by DBA
- [office](office/README.md) - office automation
- [generators](generators/README.md) - template generators


### Concept
When automation is done in many places by many different ways and technologies, then nobody knows what is actually automated and how it works.
There are many issues like configuration mismatch, version control, permission nightmare, logging, dependencies, error handling, etc.
Some CI tools like Bamboo, Gitlab CI and TeamCity try to organize them with GUI, however, they still depend on very much from the actual scripts they are supposed to run,  
and these scripts still have most of the mentioned issues. In other words, it is very handy to maintain the automation scripts when they grow, especially when they are developed by different humans. 


**The general idea of this repository is to develop and store ALL automation scripts in the same place**. 
All of them should reuse a single common configuration and should share same dev patterns.
We will call them **commands**, because they should work the same way as any shell command:
- Every command runs completely independently of the other commands
- Every command is executed in shell and could be piped like any other shell command
- Every command accepts its specific parameters and provides full --help details  

There is no framework here by reason—we want to avoid magic and give developers freedom to do anything. 
However, we should not lose time to reinvent code, and that's why every command should just use npm libs. 
[Dopamine ToolBOX](https://github.com/dichev/toolbox) provides in single package the most used libs (like parsing parameters, generating help, executing in parallel, ssh connection), 
so it's recommended (but not required) to be used it in any command to avoid writing the same boiler code without losing flexibility

### Benefits

By storing all automation commands in a single place and using the same code principles, there are coming many benefits:

- Centralized configuration—change any setting on a single place will apply to all commands, so no more missed places and configuration mismatch
- Code reuse and share knowledge - the code of all commands is visible to all members of a team, so anybody could learn, reuse and improve it
- Orchestration - writing commands with the same rules in mind allows them to be combined in different scenarios without compatibility issues
- Full visibility and logging—Every execution by any team member could be logged on any chat messaging (HipChat, Hangouts, Slack) and could be logged on a single server like mysql, prompts or just log file.
- Run sequential or in parallel
- Documentation—Every script has standard --help info to avoid human memory limits
- Simplify maintenance—now any change could be applied to all commands without misses

### Develop
There will be never complete documentation of all features and ways how to develop commands because they are actually unlimited. The best way to learn is via examples, so please read the code of the other commands

Here is what you will need to learn before scripting:
1. Learn the basics of nodejs, especially its asynchronous nature
2. Learn well how and why to use nodejs **async await**
3. Read the code of the current commands and try to modify them a bit
4. Use the IDE editor with code completion and static code validations (aka WebStorm/PhpStorm)
5. Try to create a simple command from scratch

When you want to add functionality in Dopamine ToolBOX or Dopamine configurator, the best way is to symlink them:
```bash
cd devops
git clone git@gitlab.dopamine.bg:devops/toolbox.git
git clone git@gitlab.dopamine.bg:devops/configurator.git
git clone git@gitlab.dopamine.bg:devops/automation.git

cd toolbox      && npm link && cd ..
cd configurator && npm link && cd ..
cd automation   && npm link dopamine-toolbox configurator
``` 


verbose

### Responsibility delegation
All commands could be run on any machine by any developer, however, the best way is to be stored and executed on jump machines like:
- Office Machine
- Dev Machine
- Prod Machine

By this way will be eliminated the risks of differences in local envs and local changes. Also, the access control and logging will be simplified.


### Windows setup
It's recommended to use ComEmu configured to git bash emulator.

To use the Pageant in bash, add the following:
```bash
echo "eval \$(/usr/bin/ssh-pageant -r -a '/tmp/.ssh-pageant-\$USERNAME')" >> nano ~/.bashrc
```
For Windows also add the following environment variables (remember to check that the paths are correct):
```
GIT_SSH=C:\Program Files\PuTTY\plink.exe  // This will allow git to use by default your putty keys on local environments:
PATH=C:\Program Files\Git\bin             // this will allow node to run bash (here should be stored your bash.exe)
```

### Linux setup
First, set this to ensure there will be no issues with the new line between Windows/Linux 
```bash
git config --global core.autocrlf

# Important this must be set before the repo is cloned. 
# Otherwise you should set it locally to the repo too:
# $ cd automation && git config core.autocrlf
```
Add to crontab this update script:
```
# Auto-Update automation
0 5 * * * cd /root/automation && git reset --hard && git pull && npm install && npm i configurator && npm i dopamine-toolbox && git reset --hard
```
Remember the cron user may not have git credentials, and you should create a key with gitlab access for it

### Known Issues

- Colors in the shell are displayed as ANSI codes in Windows MinGW64
```bash
?[32m hey, I am green ?[39m
```
This happens when a child process has colors, and its stdio is attached to the parent process. It seems to be a limitation of the terminal emulator, so the best way to fix it is to switch to [ConEmu](https://conemu.github.io/) and set its terminal exactly to: `"C:\Program Files\Git\bin\bash.exe"`

