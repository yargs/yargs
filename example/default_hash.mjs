#!/usr/bin/env node
import yargs from 'yargs';

const argv = yargs().default({x: 10, y: 10}).parse();
console.log(argv.x + argv.y);
