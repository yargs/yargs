var yargs = require('yargs/yargs')(process.argv.slice(2));

var argv = yargs.usage('This is my awesome program', {
  'input': {
    description: 'Input file name',
    requiresArg: true,
    short: 'i',
  },
  'output': {
    description: 'Output file name',
    requiresArg: true,
    short: 'o'
  }
}).argv;

yargs.showHelp();

console.log('\n\nInspecting options');
console.dir(argv);
