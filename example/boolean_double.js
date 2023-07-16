#!/usr/bin/env node
var argv = require('yargs/yargs')(process.argv.slice(2))
    .boolean(['x','y','z'])
    .parse()
;
console.dir([ argv.x, argv.y, argv.z ]);
console.dir(argv._);
