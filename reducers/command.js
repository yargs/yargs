const { ADD_COMMAND_HANDLERS } = require('../actions/command')
const initialState = {
  handlers: {},
  defaultCommand: undefined
}

function addCommandHandlers (state = initialState, key, value) {
  return Object.assign({}, state, {handlers: {...state.handlers, [key]: value}})
}

module.exports = function commandReducer (state = initialState, action) {
  switch (action.type) {
    case ADD_COMMAND_HANDLERS:
      return addCommandHandlers(state, action.key, action.value)
    default:
      return state
  }
}
