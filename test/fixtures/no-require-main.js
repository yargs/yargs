#!/usr/bin/env node

'use strict'

// for some unknown reason, a test environment has decided to omit require.main
delete require.main

var argv = require('./yargs/yargs.js')(process.argv.slice(2), undefined, require)
  .help('help')
  .version()
  .argv
console.log(argv)
