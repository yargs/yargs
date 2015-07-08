#!/usr/bin/env node
'use strict'

var argv = require('../../index')
  .help('help')
  .completion()
  .argv

console.log(JSON.stringify(argv._))
