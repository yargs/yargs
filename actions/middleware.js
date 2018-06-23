const GET_MIDDLEWARE = 'GET_MIDDLEWARE'
const ADD_MIDDLEWARE = 'ADD_MIDDLEWARE'
const RESET_MIDDLEWARE = 'RESET_MIDDLEWARE'

// action creators
function getMiddleware () {
  return {type: GET_MIDDLEWARE}
}

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

// action types
module.exports = {
  getMiddleware,
  addMiddleware,
  resetMiddleware,
  GET_MIDDLEWARE,
  ADD_MIDDLEWARE,
  RESET_MIDDLEWARE
}
