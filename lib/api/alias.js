const argsert = require('../argsert')

module.exports = function (options, context, populateParserHintObject) {
  return function alias (key, value) {
    argsert('<object|string|array> [string|array]', [key, value], arguments.length)
    populateParserHintObject(context.alias, true, 'alias', key, value)
    return context
  }
}
