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

// capture terminal output, so that we might
// assert against it.
exports.checkOutputAsync = function checkOutputAsync (f, argv) {
  return new Promise(async (resolve, reject) => {
    let exit = false
    const _exit = process.exit
    const _env = process.env
    const _argv = process.argv
    const _error = console.error
    const _log = console.log
    const _warn = console.warn

    process.env = Hash.merge(process.env, { _: 'node' })
    process.argv = argv || ['./usage']

    const errors = []
    const logs = []
    const warnings = []

    console.error = (msg) => { errors.push(msg) }
    console.log = (msg) => { logs.push(msg) }
    console.warn = (msg) => { warnings.push(msg) }

    let result

    process.exit = () => {
      exit = true
      done()
    }

    try {
      await f()
      if (!exit) done()
    } catch (err) {
      reset()
      reject(err)
    }

    function reset () {
      process.exit = _exit
      process.env = _env
      process.argv = _argv

      console.error = _error
      console.log = _log
      console.warn = _warn
    }

    function done () {
      reset()

      resolve({
        errors,
        logs,
        warnings,
        exit,
        result
      })
    }
  })
}

/**
 * Wrapper for calling a done() callback, and also needing:
 * - either to be async (mocha does not support both using done() and returning a promise)
 * - or to ignore exceptions already handled in .fail() (by setting ignoreExceptions to true)
 */
exports.promisifyTest = function promisifyTest (test, ignoreExceptions = false) {
  return new Promise(async (resolve, reject) => {
    let doneCalled = false
    try {
      await test(err => {
        doneCalled = true
        if (err) return reject(err)
        resolve()
      })
    } catch (err) {
      // The test fails when an exception occurs and:
      // - either the test was not expecting it (ignoreExceptions == false)
      // - or it did not handle it properly before (doneCalled == false)
      if (!ignoreExceptions || !doneCalled) reject(err)
    }
  })
}
