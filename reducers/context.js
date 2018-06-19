const {INCREMENT_CONTEXT_RESETS, ADD_FILE_TO_CONTEXT} = require('../actions/context')
const initialState = { resets: -1, commands: [], fullCommands: [], files: [] }

function incrementResets (state = initialState) {
  return Object.assign({}, state, {resets: state.resets + 1})
}

function addFileToContext (state = initialState, file) {
  return Object.assign({}, state, { files: [...state.files, file] })
}

function contextReducer (state = initialState, action = {}) {
  switch (action.type) {
    case INCREMENT_CONTEXT_RESETS:
      return incrementResets(state)
    case ADD_FILE_TO_CONTEXT:
      return addFileToContext(state, action.file)
    default:
      return state
  }
}

module.exports = contextReducer
