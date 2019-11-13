#!/usr/bin/env node
(async function main () {
  var argv = await require('yargs')
      .demand(2)
      .argv;
  console.dir(argv)
}) ();
