#!/usr/bin/env node
import yargs from 'yargs';

const y = yargs(process.argv.slice(2));

const argv = y
  .usage('This is my awesome program')
  .options({
    about: {
      description: 'Provide some details about the author of this program',
      required: true,
      alias: 'a',
    },
    info: {
      description: 'Provide some information about the node.js agains!!!!!!',
      boolean: true,
      alias: 'i',
    },
  })
  .parse();

y.showHelp();

console.log('\n\nInspecting options');
console.dir(argv);
