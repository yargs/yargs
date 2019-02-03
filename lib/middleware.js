const isPromise = require('./is-promise')

module.exports = function (globalMiddleware, context) {
  return function (callback, applyBeforeValidation = false) {
    if (Array.isArray(callback)) {
      for (let i = 0; i < callback.length; i++) {
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

module.exports.applyMiddleware = function (argv, middlewares) {
  return middlewares
    .reduce((accumulation, middleware) => {
      if (isPromise(accumulation)) {
        return accumulation
          .then(initialObj =>
            Promise.all([initialObj, middleware(initialObj)])
          )
          .then(([initialObj, middlewareObj]) =>
            Object.assign(initialObj, middlewareObj)
          )
      } else {
        const result = middleware(argv)

        return isPromise(result)
          ? result.then(middlewareObj => Object.assign(accumulation, middlewareObj))
          : Object.assign(accumulation, result)
      }
    }, argv)
}

module.exports.applyPreCheckMiddlware = function (argv, middlewares) {
  for (let i = 0; i < middlewares.length; i++) {
    if (middlewares[i](argv) instanceof Promise) {
      throw new Error('The passed in middleware with applyBeforeValidation set to true may not be used with async functions.')
    }
  }
}
