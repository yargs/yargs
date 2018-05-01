const argsert = require('../argsert')

module.exports = function (options, yargs, populateParserHintObject) {
  return function requiresArg (keys) {
    argsert('<array|string>', [keys], arguments.length)
    populateParserHintObject(yargs.nargs, false, 'narg', keys, 1)
    return yargs
  }
}
