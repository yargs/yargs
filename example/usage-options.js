#!/usr/bin/env node
var yargs = require('yargs/yargs')(process.argv.slice(2));

var argv = yargs.usage('This is my awesome program')
  .options({
    'about': {
      description: 'Provide some details about the author of this program',
      required: true,
      alias: 'a',
    },
    'info': {
      description: 'Provide some information about the node.js agains!!!!!!',
      boolean: true,
      alias: 'i'
    }
  }).parse();

yargs.showHelp();

console.log('\n\nInspecting options');
console.dir(argv);
