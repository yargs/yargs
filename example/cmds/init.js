exports.command = 'init [dir]'
exports.desc = 'Create an empty repo'
exports.builder = {
  dir: {
    default: '.'
  }
}
exports.handler = function (argv) {
  console.log('init called for dir', argv.dir)
}
