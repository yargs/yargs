module.exports = {
  command: 'within-a-dream [command] [opts]',
  desc: 'Dream within a dream',
  builder: function (yargs) {
    return yargs
      .commandDir('deeper')
      .option('with-kick', {
        desc: 'Plan a kick for controlled wake up?',
        type: 'boolean',
        global: true
      })
  },
  handler: function (argv) {
    var factor = 7
    if (argv.context) argv.context.counter++ // keep track of how many times we've invoked this handler.
    if (argv.extract) {
      if (!argv.withKick) factor -= 2
      if (!chancesLevel2(factor)) throw new Error('Something went wrong at level 2! Check your options for increased chance of success.')
      if (!argv._msg) argv._msg = 'You got lucky this time. Extraction successful.'
      return
    }
    if (!argv._msg) argv._msg = 'Let\'s not make a habit of this.'
  }
}

function chancesLevel2 (factor) {
  return Math.floor(Math.random() * 10) < factor
}
