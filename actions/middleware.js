const ADD_MIDDLEWARE = 'ADD_MIDDLEWARE'
const RESET_MIDDLEWARE = 'RESET_MIDDLEWARE'

function addMiddleware (middleware) {
  return {
    type: ADD_MIDDLEWARE,
    middleware
  }
}

function resetMiddleware () {
  return {
    type: RESET_MIDDLEWARE
  }
}

module.exports = {
  addMiddleware,
  resetMiddleware,
  ADD_MIDDLEWARE,
  RESET_MIDDLEWARE
}
