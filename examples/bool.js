#!/usr/bin/env node
var sys = require('sys');
var argv = require('optimist').argv;

if (argv.s) {
    sys.print(argv.fr ? 'Le chat dit: ' : 'The cat says: ');
}
console.log(
    (argv.fr ? 'miaou' : 'meow') + (argv.p ? '.' : '')
);
