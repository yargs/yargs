export const command = 'remote <command>'
export const desc = 'Manage set of tracked repos'
export const builder = function (yargs) {
  return yargs.commandDir('remote_cmds')
}
export function handler (argv) {}
