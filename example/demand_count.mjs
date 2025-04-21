#!/usr/bin/env node
import yargs from 'yargs';

const argv = yargs(process.argv.slice(2)).demand(2).parse();
console.dir(argv);
