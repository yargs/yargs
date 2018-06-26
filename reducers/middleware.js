const {
  ADD_MIDDLEWARE,
  RESET_MIDDLEWARE
} = require('../actions/middleware')
const initialState = []

function addMiddleware (state = initialState, middleware) {
  if (Array.isArray(middleware)) {
    return state.concat(middleware)
  } else if (typeof middleware === 'object') {
    return state.concat([middleware])
  }
}

function resetMiddleware (state = initialState) {
  return []
}

function middlewareReducer (state = initialState, action = {}) {
  switch (action.type) {
    case ADD_MIDDLEWARE:
      return addMiddleware(state, action.middleware)
    case RESET_MIDDLEWARE:
      return resetMiddleware(state)
    default:
      return state
  }
}

module.exports = middlewareReducer
