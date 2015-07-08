#!/usr/bin/env node
'use strict'

var util = require('util')
var argv = require('yargs').argv

if (argv.s) util.print(argv.fr ? 'Le chat dit: ' : 'The cat says: ')

console.log(
    (argv.fr ? 'miaou' : 'meow') + (argv.p ? '.' : '')
)
