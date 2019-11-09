#!/usr/bin/env node
var argv = require('yargs')
    .boolean(['r','v'])
    .argv
;
console.dir([ argv.r, argv.v ]);
console.dir(argv._);
