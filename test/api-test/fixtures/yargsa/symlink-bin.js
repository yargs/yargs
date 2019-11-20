#!/usr/bin/env node
var argv = require('./yargs-symlink/index.js')
  .help('help')
  .version()
  .parserConfiguration({
    'dot-notation': false,
    'boolean-negation': false
  })
  .argv
console.log(argv)
