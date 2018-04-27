const argsert = require('../argsert')

module.exports = function (options, context, populateParserHintArray) {
  return function (keys) {
    argsert('<array|string>', [keys], arguments.length)
    populateParserHintArray('boolean', keys)
    return context
  }
}
