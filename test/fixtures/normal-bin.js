#!/usr/bin/env node
var argv = require('./yargs/index.js')
  .help('help')
  .version()
  .argv
console.log(argv)
