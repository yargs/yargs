#!/usr/bin/env node
(async function main () {
  var argv = await require('yargs')
      .boolean(['x','y','z'])
      .argv
  ;
  console.dir([ argv.x, argv.y, argv.z ]);
  console.dir(argv._);
}) ();
