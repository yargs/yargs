const GET_CONTEXT = 'GET_CONTEXT'
const INCREMENT_CONTEXT_RESETS = 'INCREMENT_CONTEXT_RESETS'

// action creators
function getContext () {
  return {type: GET_CONTEXT}
}

function incrementContextResets () {
  return {
    type: INCREMENT_CONTEXT_RESETS
  }
}

// action types
module.exports = {
  getContext,
  incrementContextResets,
  GET_CONTEXT,
  INCREMENT_CONTEXT_RESETS
}
