var yargs = require('yargs');

(async function main () {
  var argv = await yargs.usage('This is my awesome program', {
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
  
  await yargs.showHelp();
  
  console.log('\n\nInspecting options');
  console.dir(argv);
}) ();
