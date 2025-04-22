export const command = 'prune <name> [names..]'
export const desc = 'Delete tracked branches gone stale for remotes'
export const builder = {}
export function handler (argv) {
  console.log('pruning remotes %s', [].concat(argv.name).concat(argv.names).join(', '))
}
