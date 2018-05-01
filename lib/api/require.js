module.exports = function (yargs) {
  return function demand (keys, max, msg) {
    // you can optionally provide a 'max' key,
    // which will raise an exception if too many '_'
    // options are provided.
    if (Array.isArray(max)) {
      max.forEach((key) => {
        yargs.demandOption(key, msg)
      })
      max = Infinity
    } else if (typeof max !== 'number') {
      msg = max
      max = Infinity
    }

    if (typeof keys === 'number') {
      yargs.demandCommand(keys, max, msg, msg)
    } else if (Array.isArray(keys)) {
      keys.forEach((key) => {
        yargs.demandOption(key, msg)
      })
    } else {
      if (typeof msg === 'string') {
        yargs.demandOption(keys, msg)
      } else if (msg === true || typeof msg === 'undefined') {
        yargs.demandOption(keys)
      }
    }

    return yargs
  }
}
