exports.command = 'cyclic'
exports.description = 'Attempts to (re)apply its own dir'
exports.builder = function (yargs) {
  return yargs.commandDir('../cmddir_cyclic')
}
exports.handler = function (argv) {}
