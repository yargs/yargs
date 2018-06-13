const {ADD_MIDDLEWARE, GET_MIDDLEWARE, RESET_MIDDLEWARE} = require('../actions/middleware')
const initialState = {
  middleware: []
}

function addMiddleware (state = initialState, middleware) {
  if (Array.isArray(middleware)) {
    return {
      middleware: state.middleware.concat(middleware)
    }
  } else if (typeof middleware === 'object') {
    return {
      middleware: state.middleware.concat([middleware])
    }
  }
}

function getMiddleware (state = initialState) {
  return state.middleware
}

function resetMiddleware (state = initialState) {
  const newState = {}
  Object.keys(state).forEach(function (key) {
    if (key === 'middleware') {
      newState[key] = []
    } else {
      newState[key] = state[key]
    }
  })
  return newState
}

function middlewareReducer (state = initialState, action = {}) {
  switch (action.type) {
    case GET_MIDDLEWARE:
      return getMiddleware(state)
    case ADD_MIDDLEWARE:
      return addMiddleware(state, action.middleware)
    case RESET_MIDDLEWARE:
      return resetMiddleware()
    default:
      return state
  }
}

module.exports = middlewareReducer
