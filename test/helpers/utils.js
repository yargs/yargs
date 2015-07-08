'use strict'

var Hash = require('hashish')

// capture terminal output, so that we might
// assert against it.
exports.checkOutput = function (f, argv) {
  var exit = false
  var _exit = process.exit
  var _env = process.env
  var _argv = process.argv
  var _error = console.error
  var _log = console.log

  process.exit = function () { exit = true }
  process.env = Hash.merge(process.env, { _: 'node' })
  process.argv = argv || [ './usage' ]

  var errors = []
  var logs = []

  console.error = function (msg) { errors.push(msg) }
  console.log = function (msg) { logs.push(msg) }

  var result = f()

  process.exit = _exit
  process.env = _env
  process.argv = _argv

  console.error = _error
  console.log = _log

  return {
    errors: errors,
    logs: logs,
    exit: exit,
    result: result
  }
}
