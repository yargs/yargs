<<<<<<< HEAD
const {GET_CONTEXT, INCREMENT_CONTEXT_RESETS} = require('../actions/context')
=======
const {GET_CONTEXT, INCREMENT_CONTEXT_RESETS, ADD_FILE_TO_CONTEXT} = require('../actions/context')
>>>>>>> I-1150: Add redux state management for usage.js.
const initialState = { resets: -1, commands: [], fullCommands: [], files: [] }

function getContext (state = initialState) {
  return state
}

function incrementResets (state = initialState) {
  return Object.assign({}, state, {resets: state.resets + 1})
}

<<<<<<< HEAD
=======
function addFileToContext (state = initialState, file) {
  return Object.assign({}, state, { files: state.files.slice().push(file) })
}

>>>>>>> I-1150: Add redux state management for usage.js.
function contextReducer (state = initialState, action = {}) {
  switch (action.type) {
    case GET_CONTEXT:
      return getContext(state)
    case INCREMENT_CONTEXT_RESETS:
      return incrementResets(state)
<<<<<<< HEAD
=======
    case ADD_FILE_TO_CONTEXT:
      return addFileToContext(state, action.file)
>>>>>>> I-1150: Add redux state management for usage.js.
    default:
      return state
  }
}

module.exports = contextReducer
