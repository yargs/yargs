#!/usr/bin/env node
var argv = require('yargs/yargs')(process.argv.slice(2))
  .usage('This is my awesome program\n\nUsage: $0 [options]')
  .help('help').alias('help', 'h')
  .version('version', '1.0.1').alias('version', 'V')
  .options({
    input: {
      alias: 'i',
      description: "<filename> Input file name",
      requiresArg: true,
      required: true
    },
    output: {
      alias: 'o',
      description: "<filename> output file name",
      requiresArg: true,
      required: true
    }
  })
  .parse();

console.log('Inspecting options');
console.dir(argv);

console.log("input:", argv.input);
console.log("output:", argv.output);
