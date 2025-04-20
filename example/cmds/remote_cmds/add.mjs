export const command = 'add <name> <url>';
export const desc = 'Add remote named <name> for repo at url <url>';
export const builder = {};
export const handler = function (argv) {
  console.log('adding remote %s at url %s', argv.name, argv.url);
};
