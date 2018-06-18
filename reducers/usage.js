const {
  SET_SHOW_HELP_ON_FAIL,
  SET_USAGE_EPILOG,
  SET_USAGE_DISABLED,
  SET_USAGES,
  ADD_USAGES,
  RESET_USAGE,
  FREEZE_USAGE,
  UNFREEZE_USAGE,
  SET_FAILURE_OUTPUT
} = require('../actions/usage')
const initialState = {
  failMessage: null,
  showHelpOnFail: true,
  failureOutput: false,
  epilog: undefined,
  usageDisabled: false,
  usages: [],
  examples: [],
  commands: [],
  frozen: {}
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

function setFailureOutput (state = initialState, value) {
  return Object.assign({}, state, { failureOutput: value })
}

function setUsageEpilog (state = initialState, value) {
  return Object.assign({}, state, { epilog: value })
}

function setUsageDisabled (state = initialState, value) {
  return Object.assign({}, state, { usageDisabled: value })
}

function setUsages (state = initialState, value) {
  return Object.assign({}, state, { usages: value.slice() })
}

function addUsages (state = initialState, value) {
  console.log('usages: ', state.usages)
  return Object.assign({}, state, { usages: state.usages.slice().push(value.slice()) })
}

function resetUsage (state = initialState) {
  return {
    failMessage: null,
    showHelpOnFail: true,
    failureOutput: false,
    epilog: undefined,
    usageDisabled: false,
    usages: [],
    examples: [],
    commands: [],
    frozen: {}
  }
}

function freezeUsage (state = initialState) {
  return Object.assign({}, state, {
    frozen: {
      failMessage: state.failMessage,
      failureOutput: state.failureOutput,
      epilog: state.epilog
    }
  })
}

function unfreezeUsage (state = initialState) {
  return Object.assign({}, state, state.frozen)
}

module.exports = function usageReducer (state = initialState, action = {}) {
  switch (action.type) {
    case SET_SHOW_HELP_ON_FAIL:
      return setShowHelpOnFail(state, action.enabled, action.message)
    case SET_FAILURE_OUTPUT:
      return setFailureOutput(state, action.value)
    case SET_USAGE_EPILOG:
      return setUsageEpilog(state, action.value)
    case SET_USAGE_DISABLED:
      return setUsageDisabled(state, action.value)
    case SET_USAGES:
      return setUsages(state, action.value)
    case ADD_USAGES:
      return addUsages(state, action.value)
    case RESET_USAGE:
      return resetUsage(state)
    case FREEZE_USAGE:
      return freezeUsage(state)
    case UNFREEZE_USAGE:
      return unfreezeUsage(state)
    default:
      return state
  }
}
