#!/usr/bin/env node

(async function main () {
  var argv = await require('yargs')
      .default({ x : 10, y : 10 })
      .argv
  ;
  
  console.log(argv.x + argv.y);
}) ();
