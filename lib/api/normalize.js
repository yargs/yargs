const argsert = require('../argsert')

module.exports = function (options, context, populateParserHintArray) {
  return function normalize (keys) {
    argsert('<array|string>', [keys], arguments.length)
    populateParserHintArray('normalize', keys)
    return context
  }
}
