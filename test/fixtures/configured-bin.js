#!/usr/bin/env node
var argv = require('./yargs/index.js')
  .parserConfiguration({ 'dot-notation': true })
  .help('help')
  .version()
  .argv
console.log(argv)
