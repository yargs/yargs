exports.command = 'prune <name> [names..]'
exports.desc = 'Delete tracked branches gone stale for remotes'
exports.builder = {}
exports.handler = function (argv) {
  console.log('pruning remotes %s', [].concat(argv.name).concat(argv.names).join(', '))
}
