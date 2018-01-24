exports.command = 'remote <command>'
exports.description = 'Manage set of tracked repos'
exports.builder = function (yargs) {
  return yargs.commandDir('remote_cmds')
}
exports.handler = function (argv) {}
