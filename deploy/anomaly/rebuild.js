#!/usr/bin/env node
'use strict';

const Program = require('dopamine-toolbox').Program
const cfg = require('configurator')

// Pipeline trigger token can be retrieved at this page: https://gitlab.dopamine.bg/devops/monitoring/anomaly/settings/ci_cd
/* You must add conf in configurator-credentials.json
    "gitlab": {
        "anomaly": {
            "gitlabCiPipelineToken": "XXXXXX"
        }
    }
 */

let program = new Program({ chat: cfg.chat.rooms.devops })

program
.description('Rebuild anomaly docker')
.example(`node deploy/rebuild`)
.run(async () => {
    let chat  = program.chat
    let shell = program.shell()

    await chat.notify('Starting anomaly Gitlab CI pipeline trigger...')

    let GITLAB_CI_PIPELINE_TOKEN = cfg.access.gitlab.anomaly.gitlabCiPipelineToken
    let result = await shell.exec(`curl -X POST -F token=${GITLAB_CI_PIPELINE_TOKEN} -F ref=master https://gitlab.dopamine.bg/api/v4/projects/1723/trigger/pipeline`)

    console.log(result)

    await chat.notify('Done')
})