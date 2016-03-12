// classic singleton yargs API, to use yargs
// without running as a singleton do:
// require('yargs/yargs')(process.argv.slice(2))
var yargs = require('./yargs')

Argv(process.argv.slice(2))

var exports = module.exports = Argv

function Argv (processArgs, cwd) {
  var argv = yargs(processArgs, cwd, require)
  processArgs = processArgs || [] // handle calling yargs().
  singletonify(argv)
  return argv
}

exports.rebase = yargs.rebase

/*  Hack an instance of Argv with process.argv into Argv
    so people can do
    require('yargs')(['--beeble=1','-z','zizzle']).argv
    to parse a list of args and
    require('yargs').argv
    to get a parsed version of process.argv.
*/
function singletonify (inst) {
  Object.keys(inst).forEach(function (key) {
    if (key === 'argv') {
      Argv.__defineGetter__(key, inst.__lookupGetter__(key))
    } else {
      Argv[key] = typeof inst[key] === 'function' ? inst[key].bind(inst) : inst[key]
    }
  })
}
