#!/usr/bin/env node
import yargs from 'yargs';

const argv = yargs(process.argv.slice(2)).parse();
console.log('(%d,%d)', argv.x, argv.y);
