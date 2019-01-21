const cfg = require('configurator')


for(let key in cfg.hosts) {

    let host = cfg.getHost(key)
    if(host.network === 'office') {
        console.log(host.name)
    }
}
