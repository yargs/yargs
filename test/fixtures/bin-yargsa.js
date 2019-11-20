#!/usr/bin/env node
var argv = require('../../index').yargsa(process.argv.slice(2))
  .help('help')
  .completion()
  .argv
console.log(JSON.stringify(argv._))
