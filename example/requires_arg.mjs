#!/usr/bin/env node
import yargs from 'yargs';

const y = yargs(process.argv.slice(2));

const argv = y
  .usage('This is my awesome program')
  .options({
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
  })
  .parse();

y.showHelp();

console.log('\n\nInspecting options');
console.dir(argv);
