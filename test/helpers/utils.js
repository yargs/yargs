'use strict'
const Hash = require('hashish')

// capture terminal output, so that we might
// assert against it.
exports.checkOutput = function checkOutput (f, argv, cb) {
  let exit = false
  const _exit = process.exit
  const _emit = process.emit
  const _env = process.env
  const _argv = process.argv
  const _error = console.error
  const _log = console.log
  const _warn = console.warn

  process.exit = () => { exit = true }
  process.env = Hash.merge(process.env, { _: 'node' })
  process.argv = argv || [ './usage' ]

  const errors = []
  const logs = []
  const warnings = []

  console.error = (msg) => { errors.push(msg) }
  console.log = (msg) => { logs.push(msg) }
  console.warn = (msg) => { warnings.push(msg) }

  let result

  if (typeof cb === 'function') {
    process.exit = () => {
      exit = true
      cb(null, done())
    }
    process.emit = function emit (ev, value) {
      if (ev === 'uncaughtException') {
        done()
        cb(value)
        return true
      }

      return _emit.apply(this, arguments)
    }

    f()
  } else {
    try {
      result = f()
    } finally {
      reset()
    }

    return done()
  }

  function reset () {
    process.exit = _exit
    process.emit = _emit
    process.env = _env
    process.argv = _argv

    console.error = _error
    console.log = _log
    console.warn = _warn
  }

  function done () {
    reset()

    return {
      errors,
      logs,
      warnings,
      exit,
      result
    }
  }
}
