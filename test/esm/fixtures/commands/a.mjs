import {commands} from './subcommands/index.mjs';

export const command = 'a';
export const describe = 'numeric commands';
export const builder = yargs => {
  yargs.command(commands);
};
export const handler = function (argv) {};
