const argsert = require('../argsert')

module.exports = function (options, context, populateParserHintObject) {
  return function coerce (keys, value) {
    argsert('<object|string|array> [function]', [keys, value], arguments.length)
    populateParserHintObject(context.coerce, false, 'coerce', keys, value)
    return context
  }
}
