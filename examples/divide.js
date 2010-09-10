#!/usr/bin/env node

var argv = require('optimist')
    .usage('Usage: $0 --foo=x --bar=y')
    .demand(['foo','bar'])
    .argv;

console.log(argv.foo / argv.bar);
