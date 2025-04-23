export const command = 'remote <command>'
export const desc = 'Manage set of tracked repos'
export function builder (yargs) {
  return yargs.commandDir('remote_cmds')
}
export function handler (argv) {}
