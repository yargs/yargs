const isPromise = require('./is-promise')

module.exports = function (globalMiddleware, context) {
  return function (callback) {
    if (Array.isArray(callback)) {
      Array.prototype.push.apply(globalMiddleware, callback)
    } else if (typeof callback === 'function') {
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
