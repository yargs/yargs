const argsert = require('../argsert')

module.exports = function (options, yargs, populateParserHintObject) {
  return function demandOption (keys, msg) {
    argsert('<object|string|array> [string]', [keys, msg], arguments.length)
    populateParserHintObject(yargs.demandOption, false, 'demandedOptions', keys, msg)
    return yargs
  }
}
