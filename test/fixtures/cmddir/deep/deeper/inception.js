exports.command = 'inception [command] [opts]'
exports.desc = 'Enter another dream, where inception is possible'
exports.builder = function (yargs) {
  return yargs
    .commandDir('deeper_still')
    .option('with-sedation', {
      desc: 'Apply a sedative?',
      type: 'boolean',
      global: true
    })
    .option('with-timed-kick', {
      desc: 'Plan an elaborate timed kick at each layer?',
      type: 'boolean',
      global: true
    })
}
exports.handler = function (argv) {
  var factor = 5
  if (argv.extract) {
    if (!argv.withSedation) factor -= 1
    if (!argv.withTimedKick) factor -= 1
    if (!chancesLevel3(factor)) throw new Error('Something went wrong at level 3! Check your options for increased chance of success.')
    if (!argv._msg) argv._msg = 'You have narrowly escaped disaster. Inception successful.'
    return
  }
  if (!chancesLevel3(factor)) throw new Error('You can no longer tell a dream from reality!')
  if (!argv._msg) argv._msg = 'Be very careful, you\'re starting to lose grip on reality.'
}

function chancesLevel3 (factor) {
  return Math.floor(Math.random() * 10) < factor
}
