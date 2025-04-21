export const command = 'remote <command>';
export const description = 'Manage set of tracked repos';
export const builder = function (yargs) {
  return yargs.commandDir('remote_cmds');
};
export const handler = function (argv) {};
