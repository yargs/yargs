#!/usr/bin/env node
import yargs from 'yargs';

const argv = yargs()
  .usage('Usage: $0 -x [num] -y [num]')
  .implies('x', 'y')
  .parse();

if (argv.x) {
  console.log(argv.x / argv.y);
}
