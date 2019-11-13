#!/usr/bin/env node
(async function main () {
  var argv = await require('yargs').argv;
  console.log('(%d,%d)', argv.x, argv.y);
}) ();
