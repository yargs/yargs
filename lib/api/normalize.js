const argsert = require('../argsert')

module.exports = function (options, yargs, populateParserHintArray) {
  return function normalize (keys) {
    argsert('<array|string>', [keys], arguments.length)
    populateParserHintArray('normalize', keys)
    return yargs
  }
}
