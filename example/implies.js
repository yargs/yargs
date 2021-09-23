#!/usr/bin/env node
var argv = require('yargs/yargs')(process.argv.slice(2))
    .usage('Usage: $0 -x [num] -y [num]')
    .implies('x', 'y')
    .argv;

if (argv.x) {
    console.log(argv.x / argv.y);
}
