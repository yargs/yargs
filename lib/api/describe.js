const argsert = require('../argsert')

module.exports = function (options, context, populateParserHintObject, usage) {
  return function (key, desc) {
    argsert('<object|string|array> [string]', [key, desc], arguments.length)
    populateParserHintObject(context.describe, false, 'key', key, true)
    usage.describe(key, desc)
    return context
  }
}
