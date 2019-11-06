#!/usr/bin/env node

'use strict'

// for some unknown reason, a test environment has decided to omit require.main
delete require.main

async function main () {
  var parser = require('../../yargs.js')(process.argv.slice(2), undefined, require)

  console.log(await parser.parserConfiguration({
    'dot-notation': false,
    'boolean-negation': false
  }).argv)
}

main()
