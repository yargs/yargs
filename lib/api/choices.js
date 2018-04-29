const argsert = require('../argsert')

module.exports = function (options, context, populateParserHintObject) {
  return function (key, value) {
    argsert('<object|string|array> [string|array]', [key, value], arguments.length)
    populateParserHintObject(context.choices, true, 'choices', key, value)
    return context
  }
}
