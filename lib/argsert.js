const command = require('./command')()

const positionName = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth']

module.exports = function (expected, otherArguments) {
  // preface the argument description with "cmd", so
  // that we can run it through yargs' command parser.
  var position = 0
  var parsed = {demanded: [], optional: []}
  if (arguments.length === 1) {
    otherArguments = expected
  } else {
    parsed = command.parseCommand('cmd ' + expected)
  }
  const argsArray = [].slice.call(otherArguments)

  if (argsArray.length < parsed.demanded.length) {
    throw Error('Not enough arguments provided. Expected ' + parsed.demanded.length +
      ' but received ' + argsArray.length + '.')
  }

  if (argsArray.length > (parsed.demanded.length + parsed.optional.length)) {
    throw Error('Too many arguments provided. Expected ' + parsed.demanded.length +
      ' but received ' + argsArray.length + '.')
  }

  parsed.demanded.forEach(function (demanded) {
    const arg = argsArray.shift()
    const observedType = Array.isArray(arg) ? 'array' : typeof arg
    const matchingTypes = demanded.cmd.filter(function (type) {
      return type === observedType
    })
    if (matchingTypes.length === 0) argumentTypeError(observedType, demanded.cmd, position, false)
    position += 1
  })

  parsed.optional.forEach(function (optional) {
    if (argsArray.length === 0) return
    const arg = argsArray.shift()
    const observedType = Array.isArray(arg) ? 'array' : typeof arg
    const matchingTypes = optional.cmd.filter(function (type) {
      return type === observedType
    })
    if (matchingTypes.length === 0) argumentTypeError(observedType, optional.cmd, position, true)
    position += 1
  })
}

function argumentTypeError (observedType, allowedTypes, position, optional) {
  throw Error('Invalid ' + positionName[position] + ' argument.' +
    ' Expected ' + allowedTypes.join(' or ') + ' but received ' + observedType + '.')
}
