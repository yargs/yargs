#!/usr/bin/env node
var argv = require('../../../../index.js').yargsa(process.argv.slice(2))
  .help('help')
  .version()
  .parserConfiguration({
    'dot-notation': false,
    'boolean-negation': false
  })
  .argv
console.log(argv)
