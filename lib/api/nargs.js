const argsert = require('../argsert')

module.exports = function (options, context, populateParserHintObject) {
  return function nargs (key, value) {
    argsert('<string|object|array> [number]', [key, value], arguments.length)
    populateParserHintObject(context.nargs, false, 'narg', key, value)
    return context
  }
}
