#!/usr/bin/env node

var argv = require('optimist')
    .default('x', 10)
    .default('y', 10)
    .argv
;

var x = parseInt(argv.x, 10);
var y = parseInt(argv.y, 10);
console.log(x + y);
