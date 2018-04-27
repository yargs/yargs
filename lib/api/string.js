const argsert = require('../argsert')

module.exports = function (options, context, populateParserHintArray) {
  return function string (keys) {
    argsert('<array|string>', [keys], arguments.length)
    populateParserHintArray('string', keys)
    return context
  }
}
