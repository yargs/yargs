var yargs = require('yargs/yargs')(process.argv.slice(2));

var argv = yargs.usage('This is my awesome program', {
  'about': {
    description: 'Provide some details about the author of this program',
    boolean: true,
    short: 'a',
  },
  'info': {
    description: 'Provide some information about this program',
    boolean: true,
    short: 'i'
  }
}).strict().argv;

yargs.showHelp();

console.log('\n\nInspecting options');
console.dir(argv);
