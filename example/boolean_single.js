#!/usr/bin/env node
var argv = require('yargs/yargs')(process.argv.slice(2))
    .boolean(['r','v'])
    .parse()
;
console.dir([ argv.r, argv.v ]);
console.dir(argv._);
