// a fairly complex CLI defined using the yargs 3.0 API:
var argv = require('yargs/yargs')(process.argv.slice(2))
  .usage('Usage: $0 <cmd> [options]') // usage string of application.
  .command('install', 'install a package (name@version)') // describe commands available.
  .command('publish', 'publish the package inside the current working directory')
  .option('f', { // document options.
    array: true, // even single values will be wrapped in [].
    description: 'an array of files',
    default: 'test.js',
    alias: 'file'
  })
  .alias('f', 'fil')
  .option('h', {
    alias: 'help',
    description: 'display help message'
  })
  .string(['user', 'pass'])
  .implies('user', 'pass') // if 'user' is set 'pass' must be set.
  .help('help')
  .demand('q') // fail if 'q' not provided.
  .version('1.0.1', 'version', 'display version information') // the version string.
  .alias('version', 'v')
  // show examples of application in action.
  .example('npm install npm@latest -g', 'install the latest version of npm')
  // final message to display when successful.
  .epilog('for more information visit https://github.com/chevex/yargs')
  // disable showing help on failures, provide a final message
  // to display for errors.
  .showHelpOnFail(false, 'whoops, something went wrong! run with --help')
  .parse();

// the parsed data is stored in argv.
console.log(argv);
