exports.command = 'blerg <foo>'

exports.describe = 'handle blerg things'

exports.builder = function (yargs) {
  return yargs
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
