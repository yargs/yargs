#!/usr/bin/env node
var argv = require('yargs/yargs')(process.argv.slice(2)).parse();

if (argv.s) {
    console.log(argv.fr ? 'Le chat dit: ' : 'The cat says: ');
}
console.log(
    (argv.fr ? 'miaou' : 'meow') + (argv.p ? '.' : '')
);
