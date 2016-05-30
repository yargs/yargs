exports.command = 'dream [command] [opts]'
exports.desc = 'Go to sleep and dream'
exports.builder = function (yargs) {
  return yargs
    .commandDir('deep', {
      extensions: ['js', 'json']
    })
    .option('shared', {
      desc: 'Is the dream shared with others?',
      type: 'boolean',
      global: true
    })
    .option('extract', {
      desc: 'Attempt extraction?',
      type: 'boolean',
      global: true
    })
}
exports.handler = function (argv) {
  if (argv.extract) {
    if (!argv.shared) throw new Error('Dream is not shared, there is no one to extract from!')
    if (!chancesLevel1()) throw new Error('Extraction failed!')
    if (!argv._msg) argv._msg = 'Extraction succesful'
  }
  if (argv._msg) console.log(argv._msg)
  else console.log(argv.shared ? 'Training session over' : 'Well, that was a refreshing nap')
}

function chancesLevel1 () {
  return Math.floor(Math.random() * 10) < 9
}
