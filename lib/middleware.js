'use strict'

// hoisted due to circular dependency on command.
module.exports = {
  applyMiddleware,
  commandMiddlewareFactory,
  globalMiddlewareFactory
}
const argsert = require('./argsert')

function globalMiddlewareFactory (globalMiddleware, context) {
  return function (callback, applyBeforeValidation = false) {
    argsert('<array|function> [boolean]', [callback, applyBeforeValidation], arguments.length)
    if (Array.isArray(callback)) {
      for (let i = 0; i < callback.length; i++) {
        if (typeof callback[i] !== 'function') {
          throw Error('middleware must be a function')
        }
        callback[i].applyBeforeValidation = applyBeforeValidation
      }
      Array.prototype.push.apply(globalMiddleware, callback)
    } else if (typeof callback === 'function') {
      callback.applyBeforeValidation = applyBeforeValidation
      globalMiddleware.push(callback)
    }
    return context
  }
}

function commandMiddlewareFactory (commandMiddleware) {
  if (!commandMiddleware) return []
  return commandMiddleware.map(middleware => {
    middleware.applyBeforeValidation = false
    return middleware
  })
}

async function applyMiddleware (argv, yargs, middlewares, beforeValidation) {
  for (let middleware of middlewares.filter(m => m.applyBeforeValidation === beforeValidation)) {
    Object.assign(argv, await middleware(argv, yargs))
  }
}
