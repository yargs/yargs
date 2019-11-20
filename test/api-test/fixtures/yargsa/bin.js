#!/usr/bin/env node
var argv = require('../../index')
  .help('help')
  .completion()
  .argv
console.log(JSON.stringify(argv._))
