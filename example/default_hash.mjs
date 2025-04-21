#!/usr/bin/env node
import yargs from 'yargs';

const argv = yargs(process.argv.slice(2)).default({x: 10, y: 10}).parse();
console.log(argv.x + argv.y);
