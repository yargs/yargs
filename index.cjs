'use strict';
// classic singleton yargs API, to use yargs
// without running as a singleton do:
// require('yargs/yargs')(process.argv.slice(2))
const {Yargs, processArgv} = require('./build/index.cjs');

Argv(processArgv.hideBin(process.argv));

module.exports = Argv;

function Argv(processArgs, cwd) {
  const argv = Yargs(processArgs, cwd, require);
  singletonify(argv);
  // TODO(bcoe): warn if argv.parse() or argv.argv is used directly.
  return argv;
}

/*  Hack an instance of Argv with process.argv into Argv
    so people can do
    require('yargs')(['--beeble=1','-z','zizzle']).argv
    to parse a list of args and
    require('yargs').argv
    to get a parsed version of process.argv.
*/
function singletonify(inst) {
  [
    ...Object.keys(inst),
    ...Object.getOwnPropertyNames(inst.constructor.prototype),
  ].forEach(key => {
    if (key === 'argv') {
      Object.defineProperty(Argv, key, Object.getOwnPropertyDescriptor(inst, key));
    } else if (typeof inst[key] === 'function') {
      Argv[key] = inst[key].bind(inst);
    } else {
      Object.defineProperty(Argv, '$0', {
        configurable: true,
        enumerable: true,
        get() {
          return inst.$0;
        }
      });
      Object.defineProperty(Argv, 'parsed', {
        configurable: true,
        enumerable: true,
        get() {
          return inst.parsed;
        }
      });
    }
  });
}
