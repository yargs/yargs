#!/usr/bin/env node
var argv = require('yargs/yargs')(process.argv.slice(2))
    .default({ x : 10, y : 10 })
    .argv
;

console.log(argv.x + argv.y);
