const argsert = require('../argsert')

module.exports = function (options, context, populateParserHintArray) {
  return function array (keys) {
    argsert('<array|string>', [keys], arguments.length)
    populateParserHintArray('array', keys)
    return context
  }
}
