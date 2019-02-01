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
