#!/usr/bin/env node
(async function main () {
  var argv = await require('yargs')
      .boolean(['r','v'])
      .argv
  ;
  console.dir([ argv.r, argv.v ]);
  console.dir(argv._);
}) ();
