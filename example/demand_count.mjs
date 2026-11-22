#!/usr/bin/env node
import yargs from 'yargs';

const argv = yargs().demand(2).parse();
console.dir(argv);
