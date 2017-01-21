const util = require('util')

function YError (msg) {
  this.name = 'YError'
  this.message = msg || 'yargs error'
  this.stack = (new Error()).stack
}

util.inherits(YError, Error)

module.exports = YError
