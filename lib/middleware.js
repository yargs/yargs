module.exports = function (globalMiddleware, context, performPreCheck) {
  return function (callback) {
    if (performPreCheck) {
      callback.performPreCheck = true
    }
    if (Array.isArray(callback)) {
      Array.prototype.push.apply(globalMiddleware, callback)
    } else if (typeof callback === 'function') {
      globalMiddleware.push(callback)
    }
    return context
  }
}
