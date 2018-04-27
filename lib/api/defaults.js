const argsert = require('../argsert')

module.exports = function (options, context, populateParserHintObject, usage) {
  return function (key, value, defaultDescription) {
    argsert('<object|string|array> [*] [string]', [key, value, defaultDescription], arguments.length)
    if (defaultDescription) options.defaultDescription[key] = defaultDescription
    if (typeof value === 'function') {
      if (!options.defaultDescription[key]) options.defaultDescription[key] = usage.functionDescription(value)
      value = value.call()
    }
    populateParserHintObject(context.default, false, 'default', key, value)
    return context
  }
}
