const argsert = require('../argsert')

module.exports = function (options, yargs, populateParserHintArray) {
  return function count (keys) {
    argsert('<array|string>', [keys], arguments.length)
    populateParserHintArray('count', keys)
    return yargs
  }
}
