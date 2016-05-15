#!/usr/bin/env node
var yargs = require('../../index')
var y = yargs.command('download <url> <files..>', 'make a get HTTP request')
  .help()

for (var i = 0; i < 2000; i++) {
  yargs.option('o' + i, {
    describe: 'option ' + i
  })
}

y.argv

console.log('never get here')
