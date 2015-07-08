#!/usr/bin/env node
'use strict'

var argv = require('yargs')
    .boolean(['x', 'y', 'z'])
    .argv

console.dir([ argv.x, argv.y, argv.z ])
console.dir(argv._)
