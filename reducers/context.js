const {GET_CONTEXT, INCREMENT_CONTEXT_RESETS} = require('../actions/context')
const initialState = { resets: -1, commands: [], fullCommands: [], files: [] }

function getContext (state = initialState) {
  return state
}

function incrementResets (state = initialState) {
  return Object.assign({}, state, {resets: state.resets + 1})
}

function contextReducer (state = initialState, action = {}) {
  switch (action.type) {
    case GET_CONTEXT:
      return getContext(state)
    case INCREMENT_CONTEXT_RESETS:
      return incrementResets(state)
    default:
      return state
  }
}

module.exports = contextReducer
