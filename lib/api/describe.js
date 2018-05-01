const argsert = require('../argsert')

module.exports = function (options, yargs, populateParserHintObject, usage) {
  return function (key, desc) {
    argsert('<object|string|array> [string]', [key, desc], arguments.length)
    populateParserHintObject(yargs.describe, false, 'key', key, true)
    usage.describe(key, desc)
    return yargs
  }
}
