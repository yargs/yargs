const argsert = require('../argsert')

module.exports = function (context, command, parentRequire, require) {
  return function (dir, opts) {
    argsert('<string> [object]', [dir, opts], arguments.length)
    const req = parentRequire || require
    command.addDirectory(dir, context.getContext(), req, require('get-caller-file')(), opts)
    return context
  }
}
