const argsert = require('../argsert')

module.exports = function (options, yargs, populateParserHintObject) {
  return function nargs (key, value) {
    argsert('<string|object|array> [number]', [key, value], arguments.length)
    populateParserHintObject(yargs.nargs, false, 'narg', key, value)
    return yargs
  }
}
