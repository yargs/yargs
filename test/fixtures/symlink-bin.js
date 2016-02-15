#!/usr/bin/env node
var argv = require('./yargs-symlink/index.js')
  .help('help')
  .version()
  .argv
console.log(argv)
