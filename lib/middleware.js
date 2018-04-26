module.exports = function (globalMiddleware, callback) {
  if (Array.isArray(callback)) {
    Array.prototype.push.apply(globalMiddleware, callback)
  } else if (typeof callback === 'object') {
    globalMiddleware.push(callback)
  }
  return this
}
