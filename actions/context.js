const GET_CONTEXT = 'GET_CONTEXT'
const INCREMENT_CONTEXT_RESETS = 'INCREMENT_CONTEXT_RESETS'
const ADD_FILE_TO_CONTEXT = 'ADD_FILE_TO_CONTEXT'

// action creators
function getContext () {
  return {type: GET_CONTEXT}
}

function incrementContextResets () {
  return {
    type: INCREMENT_CONTEXT_RESETS
  }
}

function addFileToContext (file) {
  return {
    type: ADD_FILE_TO_CONTEXT,
    file
  }
}

// action types
module.exports = {
  getContext,
  incrementContextResets,
  addFileToContext,
  GET_CONTEXT,
  INCREMENT_CONTEXT_RESETS,
  ADD_FILE_TO_CONTEXT
}
