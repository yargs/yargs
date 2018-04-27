const argsert = require('../argsert')

module.exports = function (options, context, populateParserHintArray) {
  return function skipValidation (keys) {
    argsert('<array|string>', [keys], arguments.length)
    populateParserHintArray('skipValidation', keys)
    return context
  }
}
