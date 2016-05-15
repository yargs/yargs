#!/usr/bin/env node
var yargs = require('../../index')
var y = yargs.command('download <url> <files..>', 'make a get HTTP request')
  .help()
var longDescription = ''

for (var i = 0; i < 5000; i++) {
  longDescription += 'a very long description ' + i
}

yargs.option('o', {
  describe: longDescription
})

y.argv

console.log('never get here')
