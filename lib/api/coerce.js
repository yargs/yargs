const argsert = require('../argsert')

module.exports = function (options, yargs, populateParserHintObject) {
  return function coerce (keys, value) {
    argsert('<object|string|array> [function]', [keys, value], arguments.length)
    populateParserHintObject(yargs.coerce, false, 'coerce', keys, value)
    return yargs
  }
}
