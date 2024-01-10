#!/usr/bin/env node
var yargs = require('yargs/yargs')(process.argv.slice(2));

var argv = yargs.usage('This is my awesome program').options({
  input: {
    description: 'Input file name',
    requiresArg: true,
    alias: 'i',
  },
  output: {
    description: 'Output file name',
    requiresArg: true,
    alias: 'o',
  },
}).parse();

yargs.showHelp();

console.log('\n\nInspecting options');
console.dir(argv);
