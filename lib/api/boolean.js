const argsert = require('../argsert')

module.exports = function (options, yargs, populateParserHintArray) {
  return function (keys) {
    argsert('<array|string>', [keys], arguments.length)
    populateParserHintArray('boolean', keys)
    return yargs
  }
}
