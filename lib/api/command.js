const argsert = require('../argsert')

module.exports = function (yargs, command) {
  return function (cmd, description, builder, handler, middlewares) {
    argsert('<string|array|object> [string|boolean] [function|object] [function] [array]', [cmd, description, builder, handler, middlewares], arguments.length)
    command.addHandler(cmd, description, builder, handler, middlewares)
    return yargs
  }
}
