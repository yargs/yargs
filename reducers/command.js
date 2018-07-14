const { ADD_COMMAND_HANDLERS, ADD_COMMAND } = require('../actions/command')
const initialState = {
  handlers: {},
  defaultCommand: undefined
}

// function setDefaultCommand (state, value) {
//
// }

function addCommandHandlers (state = initialState, key, value) {
  return Object.assign({}, state, {handlers: Object.assign({}, state.handlers, {[key]: value})})
}

module.exports = function commandReducer (state = initialState, action) {
  switch (action.type) {
    case ADD_COMMAND_HANDLERS:
      return addCommandHandlers(state, action.key, action.value)
    case ADD_COMMAND:
      // return addCommand(state, action)
      return state
    default:
      return state
  }
}
