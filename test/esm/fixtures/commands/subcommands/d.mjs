export const command = 'd <x> <y>';
export const describe = 'multiply x by y';
export const builder = yargs => {};
export const handler = function (argv) {
  argv.output.value = argv.x * argv.y;
};
