export const command = 'b <str1> <str2>';
export const describe = 'string commands';
export const builder = yargs => {
  yargs.string(['str1', 'str2']);
};
export const handler = function (argv) {
  argv.output.text = `${argv.str1} ${argv.str2}`;
};
