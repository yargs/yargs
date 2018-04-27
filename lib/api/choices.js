const argsert = require('../argsert')

module.exports = function (options, context, populateParserHintObject) {
  return function (key, value) {
    argsert('<object|string|array> [string|array]', [key, value], arguments.length)
    populateParserHintObject(this.choices, true, 'choices', key, value)
    return this
  }
}
