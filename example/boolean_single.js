#!/usr/bin/env node
'use strict'

var argv = require('yargs')
    .boolean('v')
    .argv

console.dir(argv.v)
console.dir(argv._)
