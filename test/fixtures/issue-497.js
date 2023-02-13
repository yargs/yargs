#!/usr/bin/env node
/* eslint-disable node/shebang */

/* eslint-disable no-undef */
// pretend we are a TTY
process.stdout.isTTY = true;
process.stderr.isTTY = true;
process.stderr.hasColors = () => true;

const yargs = require('../../');
const y = yargs
  .command('download <url> <files..>', 'make a get HTTP request')
  .help();

for (let i = 0; i < 1000; i++) {
  yargs.option('o' + i, {
    describe: 'option ' + i,
  });
}

y.parse();

console.log('never get here');
