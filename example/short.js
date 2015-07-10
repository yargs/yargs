#!/usr/bin/env node
'use strict'

var argv = require('yargs').argv
console.log('(%d,%d)', argv.x, argv.y)
