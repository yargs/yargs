#!/usr/bin/env node
var argv = require('optimist')
    .demandCount(2)
    .argv;
console.dir(argv)