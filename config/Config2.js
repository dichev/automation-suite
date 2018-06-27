const Config = {
    
    operators: {
        rtg:              { name: 'rtg',          dir: 'rtg',             server: 'belgium',      domain: 'redtiger.cash'   },
        bots:             { name: 'bots',         dir: 'bots',            server: 'belgium',      domain: 'redtiger.cash'   },
        approv:           { name: 'approv',       dir: 'approv',          server: 'iom',          domain: 'tgp.cash'        },
        betconstruct:     { name: 'betconstruct', dir: 'betconstruct',    server: 'iom',          domain: 'tgp.cash'        },
        bede:             { name: 'bede',         dir: 'bede',            server: 'iom',          domain: 'tgp.cash'        },
        betfairmars:      { name: 'betfairmars',  dir: 'betfairmars',     server: 'iom',          domain: 'tgp.cash'        },
        igc:              { name: 'igc',          dir: 'igc',             server: 'iom',          domain: 'tgp.cash'        },
        kindred:          { name: 'kindred',      dir: 'kindredgroup',    server: 'iom',          domain: 'tgp.cash'        },
        matchbook:        { name: 'matchbook',    dir: 'matchbook',       server: 'iom',          domain: 'tgp.cash'        },
        plaingaming:      { name: 'plaingaming',  dir: 'plaingaming',     server: 'iom',          domain: 'tgp.cash'        },
        paddymars:        { name: 'paddymars',    dir: 'paddymars',       server: 'iom',          domain: 'tgp.cash'        },
        rank:             { name: 'rank',         dir: 'rank',            server: 'iom',          domain: 'tgp.cash'        },
        techsson:         { name: 'techsson',     dir: 'techsson',        server: 'iom',          domain: 'tgp.cash'        },
        ugseu:            { name: 'ugseu',        dir: 'ugs',             server: 'iom',          domain: 'tgp.cash'        },
        videoslots:       { name: 'videoslots',   dir: 'videoslots',      server: 'iom',          domain: 'tgp.cash'        },
        leovegas:         { name: 'leovegas',     dir: 'leovegas',        server: 'iom',          domain: 'tgp.cash'        },
        mrgreen:          { name: 'mrgreen',      dir: 'mrgreen',         server: 'iom',          domain: 'tgp.cash'        },
        sunbingo:         { name: 'sunbingo',     dir: 'sunbingo',        server: 'iom',          domain: 'tgp.cash'        },
        pomadorro:        { name: 'pomadorro',    dir: 'pomadorro',       server: 'iom',          domain: 'tgp.cash'        },
        pinnacle:         { name: 'pinnacle',     dir: 'pinnacle',        server: 'iom',          domain: 'tgp.cash'        },
        williamhill:      { name: 'williamhill',  dir: 'williamhill',     server: 'gib',          domain: 'rtggib.cash'     },
        gvc:              { name: 'gvc',          dir: 'gbp',             server: 'gib',          domain: 'rtggib.cash'     },
        pop:              { name: 'pop',          dir: 'pop',             server: 'gib',          domain: 'rtggib.cash'     },
        gamesys:          { name: 'gamesys',      dir: 'gamesys',         server: 'gib',          domain: 'rtggib.cash'     },
        nektan:           { name: 'nektan',       dir: 'nektan',          server: 'gib',          domain: 'rtggib.cash'     },
       '138global':       { name: '138global',    dir: '138global',       server: 'gib',          domain: 'rtggib.cash'     },
        aggfun:           { name: 'aggfun',       dir: 'aggfun',          server: 'taiwan',       domain: 'm-gservices.com' },
        ugs2:             { name: 'ugs2',         dir: 'ugs2',            server: 'taiwan',       domain: 'm-gservices.com' },
        ugs4:             { name: 'ugs4',         dir: 'ugs4',            server: 'taiwan',       domain: 'm-gservices.com' },
        ugs3:             { name: 'ugs3',         dir: 'ugs3',            server: 'manila',       domain: 'm-gservices.com' },
        ugs1:             { name: 'ugs1',         dir: 'ugs1',            server: 'manila',       domain: 'm-gservices.com' },
        pokerstars:       { name: 'pokerstars',   dir: 'pokerstars',      server: 'pokerstars',   domain: 'redtiger.cash'   },
    },
    
    servers: {
        gib: {
            name: 'gib',
            hosts: {
                lb: '192.168.221.99',
                mysql: '192.168.221.111',
            },
            blue:  ['web1', 'web2', 'web3'],
            green: ['web4', 'web5']
        },
        manila: {
            name: 'manila',
            hosts: {
                lb: '192.168.202.100',
                mysql: '192.168.202.101',
            },
            blue:  ['web1', 'web2', 'web3'],
            green: ['web4', 'web5']
        },
        taiwan: {
            name: 'taiwan',
            hosts: {
                lb: '10.140.1.99',
                mysql: '10.140.1.101',
            },
            blue:  ['web1', 'web2', 'web3'],
            green: ['web4', 'web5']
        },
        pokerstars: {
            name: 'pokerstars',
            hosts: {
                lb: '10.77.23.2',
                mysql: '10.77.23.50',
            },
            blue:  ['web1', 'web2', 'web3'],
            green: ['web4', 'web5']
        },
        iom: {
            name: 'iom',
            hosts: {
                lb: '192.168.212.100',
                mysql: '192.168.212.101',
            },
            blue:  ['web1', 'web2', 'web3'],
            green: ['web4', 'web5']
        },
        belgium: {
            name: 'belgium',
            hosts: {
                lb: '10.132.1.99',
                mysql: '10.132.1.101',
                archive: '10.132.1.101', // same as master!
                web1: '10.132.1.103',
            },
            blue:  ['web1'],
            green: ['web2']
        }
    }

}
module.exports = Config