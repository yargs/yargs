import {commands} from './subcommands/index.mjs';

export const command = 'a';
export const describe = 'numeric commands';
export const builder = yargs => {
  yargs.command(commands);
};
// eslint-disable-next-line no-unused-vars
export const handler = function (argv) {};
