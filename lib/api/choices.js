const argsert = require('../argsert')

module.exports = function (options, yargs, populateParserHintObject) {
  return function (key, value) {
    argsert('<object|string|array> [string|array]', [key, value], arguments.length)
    populateParserHintObject(yargs.choices, true, 'choices', key, value)
    return yargs
  }
}
