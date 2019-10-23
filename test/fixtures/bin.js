#!/usr/bin/env node
async function main () {
  var argv = await require('../../index')
    .help('help')
    .completion()
    .argv
  console.log(JSON.stringify(argv._))
}

main()
