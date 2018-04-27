const argsert = require('../argsert')

module.exports = function (options, context, populateParserHintObject) {
  return function demandOption (keys, msg) {
    argsert('<object|string|array> [string]', [keys, msg], arguments.length)
    populateParserHintObject(context.demandOption, false, 'demandedOptions', keys, msg)
    return context
  }
}
