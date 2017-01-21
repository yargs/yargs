const util = require('util')

function YError (msg) {
  this.name = 'YError'
  this.message = msg || 'yargs error'
  Error.captureStackTrace(this, YError)
}

util.inherits(YError, Error)

module.exports = YError
