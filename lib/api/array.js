const argsert = require('../argsert')

module.exports = function (options, yargs, populateParserHintArray) {
  return function array (keys) {
    argsert('<array|string>', [keys], arguments.length)
    populateParserHintArray('array', keys)
    return yargs
  }
}
