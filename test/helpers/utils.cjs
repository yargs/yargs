'use strict';
const Hash = require('hashish');
const {format} = require('util');

// capture terminal output, so that we might
// assert against it.
exports.checkOutput = function checkOutput(f, argv, cb) {
  let exit = false;
  let exitCode = 0;
  const _exit = process.exit;
  const _emit = process.emit;
  const _env = process.env;
  const _argv = process.argv;
  const _error = console.error;
  const _log = console.log;
  const _warn = console.warn;

  process.exit = code => {
    exit = true;
    exitCode = code;
  };
  process.env = Hash.merge(process.env, {_: 'node'});
  process.argv = argv || ['./usage'];

  const errors = [];
  const logs = [];
  const warnings = [];

  console.error = (...msg) => {
    errors.push(format(...msg));
  };
  console.log = (...msg) => {
    logs.push(format(...msg));
  };
  console.warn = (...msg) => {
    warnings.push(format(...msg));
  };

  let result;

  if (typeof cb === 'function') {
    process.exit = () => {
      exit = true;
      cb(null, done());
    };
    process.emit = function emit(ev, value) {
      if (ev === 'uncaughtException') {
        cb(value, done());
        return true;
      }

      return _emit.apply(this, arguments);
    };

    f();
  } else {
    try {
      result = f();
      if (typeof result.then === 'function') {
        return result
          .then(() => {
            reset();
            return done();
          })
          .catch(() => {
            reset();
            return done();
          });
      } else {
        reset();
      }
    } catch (_err) {
      reset();
    }
    return done();
  }

  function reset() {
    process.exit = _exit;
    process.emit = _emit;
    process.env = _env;
    process.argv = _argv;

    console.error = _error;
    console.log = _log;
    console.warn = _warn;
  }

  function done() {
    reset();

    return {
      errors,
      logs,
      warnings,
      exit,
      exitCode,
      result,
    };
  }
};
