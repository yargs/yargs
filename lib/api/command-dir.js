const argsert = require('../argsert')

module.exports = function (yargs, command, parentRequire, require) {
  return function (dir, opts) {
    argsert('<string> [object]', [dir, opts], arguments.length)
    const req = parentRequire || require
    command.addDirectory(dir, yargs.getContext(), req, require('get-caller-file')(), opts)
    return yargs
  }
}
