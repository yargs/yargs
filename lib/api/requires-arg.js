const argsert = require('../argsert')

module.exports = function (options, context, populateParserHintObject) {
  return function requiresArg (keys) {
    argsert('<array|string>', [keys], arguments.length)
    populateParserHintObject(context.nargs, false, 'narg', keys, 1)
    return context
  }
}
