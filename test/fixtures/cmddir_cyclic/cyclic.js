exports.command = 'cyclic'
exports.description = 'Attempts to (re)apply its own dir'
exports.builder = function (y) {
  return y.commandDir('../cmddir_cyclic')
}
exports.handler = function (argv) {}
