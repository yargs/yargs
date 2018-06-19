const SET_SHOW_HELP_ON_FAIL = 'SET_SHOW_HELP_ON_FAIL'
const RESET_USAGE = 'RESET_USAGE'
const FREEZE_USAGE = 'FREEZE_USAGE'
const UNFREEZE_USAGE = 'UNFREEZE_USAGE'
const SET_FAILURE_OUTPUT = 'SET_FAILURE_OUTPUT'
const SET_USAGE_EPILOG = 'SET_USAGE_EPILOG'
const SET_USAGE_DISABLED = 'SET_USAGE_DISABLED'
const SET_USAGES = 'SET_USAGES'
const ADD_USAGES = 'ADD_USAGES'

function setShowHelpOnFail (enabled, message) {
  return {
    type: SET_SHOW_HELP_ON_FAIL,
    enabled,
    message
  }
}

function setFailureOutput (value) {
  return {
    type: SET_FAILURE_OUTPUT,
    value
  }
}

function setUsageEpilog (value) {
  return {
    type: SET_USAGE_EPILOG,
    value
  }
}

function setUsageDisabled (value) {
  return {
    type: SET_USAGE_DISABLED,
    value
  }
}

function setUsages (value) {
  return {
    type: SET_USAGES,
    value
  }
}

function addUsages (msg, description = '') {
  return {
    type: ADD_USAGES,
    msg,
    description
  }
}

function resetUsage () {
  return {
    type: RESET_USAGE
  }
}

function freezeUsage () {
  return {
    type: FREEZE_USAGE
  }
}

function unfreezeUsage () {
  return {
    type: UNFREEZE_USAGE
  }
}

module.exports = {
  setShowHelpOnFail,
  setFailureOutput,
  setUsageEpilog,
  setUsageDisabled,
  setUsages,
  addUsages,
  resetUsage,
  freezeUsage,
  unfreezeUsage,
  SET_SHOW_HELP_ON_FAIL,
  SET_FAILURE_OUTPUT,
  SET_USAGE_EPILOG,
  SET_USAGE_DISABLED,
  SET_USAGES,
  ADD_USAGES,
  RESET_USAGE,
  FREEZE_USAGE,
  UNFREEZE_USAGE
}
