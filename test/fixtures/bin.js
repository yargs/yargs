#!/usr/bin/env node
var argv = require('../../')
  .help('help')
  .completion()
  .argv
console.log(JSON.stringify(argv._))
