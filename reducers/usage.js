const {SET_SHOW_HELP_ON_FAIL, GET_SHOW_HELP_ON_FAIL, RESET_USAGE} = require('../actions/usage')
const initialState = {
  failMessage: null,
  showHelpOnFail: true
}

function setShowHelpOnFail (state = initialState, enabled, message) {
  if (typeof enabled === 'string') {
    message = enabled
    enabled = true
  } else if (typeof enabled === 'undefined') {
    enabled = true
  }
  return Object.assign({}, state, {
    failMessage: message,
    showHelpOnFail: enabled
  })
}

function getShowHelpOnFail (state = initialState) {
  return state
}

function resetUsage (state = initialState) {
  return Object.assign({}, state, {failMessage: null, showHelpOnFail: true})
}

module.exports = function usageReducer (state = initialState, action = {}) {
  switch (action.type) {
    case SET_SHOW_HELP_ON_FAIL:
      return setShowHelpOnFail(state, action.enabled, action.message)
    case GET_SHOW_HELP_ON_FAIL:
      return getShowHelpOnFail(state)
    case RESET_USAGE:
      return resetUsage(state)
    default:
      return state
  }
}
