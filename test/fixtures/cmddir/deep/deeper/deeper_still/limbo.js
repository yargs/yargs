exports.command = 'limbo [opts]'
exports.desc = 'Get lost in pure subconscious'
exports.builder = {
  'with-self-exit': {
    desc: 'Pretty much your only way out',
    type: 'boolean'
  },
  'with-totem': {
    desc: 'Take your totem with you',
    type: 'boolean'
  }
}
exports.handler = function (argv) {
  var factor = 3
  if (!argv.withSelfExit) throw new Error('You entered limbo without a way out!')
  if (!argv.withTotem) factor -= 2
  if (argv.extract) {
    if (!chancesLevel4(factor)) throw new Error('You didn\'t have much chance anyway, you\'re stuck in limbo!')
    if (!argv._msg) argv._msg = 'You have accomplished the impossible. Inception successful.'
    return
  }
  if (!chancesLevel4(factor)) throw new Error('You rolled the dice and lost, you\'re stuck in limbo!')
  if (!argv._msg) argv._msg = 'Can you ever be sure of what\'s real anymore?'
}

function chancesLevel4 (factor) {
  return Math.floor(Math.random() * 10) < factor
}
