#!/usr/bin/env node
import yargs from 'yargs';

const argv = yargs().parse();
console.log('(%d,%d)', argv.x, argv.y);
console.log(argv._);
