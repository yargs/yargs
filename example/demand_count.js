#!/usr/bin/env node
var argv = require('yargs/yargs')(process.argv.slice(2))
    .demand(2)
    .parse();
console.dir(argv)
