#!/usr/bin/env node

(async function main () {
  var argv = await require('yargs')
      .usage('Usage: $0 -x [num] -y [num]')
      .demand(['x','y'])
      .argv;
  
  console.log(argv.x / argv.y);
}) ();
