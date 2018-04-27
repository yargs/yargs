const argsert = require('../argsert')

module.exports = function (options, context, populateParserHintArray) {
  return function number (keys) {
    argsert('<array|string>', [keys], arguments.length)
    populateParserHintArray('number', keys)
    return context
  }
}
