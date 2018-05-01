const argsert = require('../argsert')

module.exports = function (options, yargs, populateParserHintObject) {
  return function alias (key, value) {
    argsert('<object|string|array> [string|array]', [key, value], arguments.length)
    populateParserHintObject(yargs.alias, true, 'alias', key, value)
    return yargs
  }
}
