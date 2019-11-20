exports.command = 'blerg <foo>'

exports.describe = 'handle blerg things'

exports.builder = function (y) {
  return y
    .option('banana', {
      default: 'cool'
    })
    .option('batman', {
      default: 'sad'
    })
}

exports.handler = function (argv) {
  global.commandHandlerCalledWith = argv
}
