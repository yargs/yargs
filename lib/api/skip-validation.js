const argsert = require('../argsert')

module.exports = function (options, yargs, populateParserHintArray) {
  return function skipValidation (keys) {
    argsert('<array|string>', [keys], arguments.length)
    populateParserHintArray('skipValidation', keys)
    return yargs
  }
}
