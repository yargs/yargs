#!/usr/bin/env node
import yargs from 'yargs';

const argv = yargs(process.argv.slice(2))
  .usage('Usage: $0 -x [num] -y [num]')
  .demand(['x', 'y'])
  .parse();

console.log(argv.x / argv.y);
