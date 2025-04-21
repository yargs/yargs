#!/usr/bin/env node
import yargs from 'yargs';

const argv = yargs(process.argv.slice(2))
  .count('verbose')
  .alias('v', 'verbose')
  .parse();

const VERBOSE_LEVEL = argv.verbose;

function WARN() {
  VERBOSE_LEVEL >= 0 && console.log.apply(console, arguments);
}
function INFO() {
  VERBOSE_LEVEL >= 1 && console.log.apply(console, arguments);
}
function DEBUG() {
  VERBOSE_LEVEL >= 2 && console.log.apply(console, arguments);
}

WARN('Showing only important stuff');
INFO('Showing semi-important stuff too');
DEBUG('Extra chatty mode');
