#!/usr/bin/env node
var argv = require('yargs/yargs')(process.argv.slice(2)).argv;
console.log('(%d,%d)', argv.x, argv.y);
console.log(argv._);
