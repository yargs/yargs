const {addMiddleware} = require('../actions/middleware')
const store = require('./store')

module.exports = function (context) {
  return function (middleware) {
    store.dispatch(addMiddleware(
      middleware
    ))
    return context
  }
}
