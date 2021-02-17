export const command = 'c <x> <y>';
export const describe = 'add x to y';
// eslint-disable-next-line no-unused-vars
export const builder = yargs => {};
export const handler = function (argv) {
  argv.output.value = argv.x + argv.y;
};
