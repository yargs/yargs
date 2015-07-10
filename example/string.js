#!/usr/bin/env node
'use strict'

var argv = require('yargs')
    .string('x', 'y')
    .argv

console.dir([ argv.x, argv.y ])

/* Turns off numeric coercion:
    ./node string.js -x 000123 -y 9876
    [ '000123', '9876' ]
*/
