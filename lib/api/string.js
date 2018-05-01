const argsert = require('../argsert')

module.exports = function (options, yargs, populateParserHintArray) {
  return function string (keys) {
    argsert('<array|string>', [keys], arguments.length)
    populateParserHintArray('string', keys)
    return yargs
  }
}
