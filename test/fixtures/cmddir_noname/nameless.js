exports.description = 'Command name derived from module filename'

exports.builder = {
  banana: {
    default: 'cool'
  },
  batman: {
    default: 'sad'
  }
}

exports.handler = function (argv) {
  global.commandHandlerCalledWith = argv
}
