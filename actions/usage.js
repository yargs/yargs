const SET_SHOW_HELP_ON_FAIL = 'SET_SHOW_HELP_ON_FAIL'
const GET_SHOW_HELP_ON_FAIL = 'GET_SHOW_HELP_ON_FAIL'
const RESET_USAGE = 'RESET_USAGE'
const FREEZE_USAGE = 'FREEZE_USAGE'
const UNFREEZE_USAGE = 'UNFREEZE_USAGE'
const SET_FAILURE_OUTPUT = 'SET_FAILURE_OUTPUT'

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

function getShowHelpOnFail () {
  return {
    type: GET_SHOW_HELP_ON_FAIL
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
  getShowHelpOnFail,
  resetUsage,
  freezeUsage,
  unfreezeUsage,
  SET_SHOW_HELP_ON_FAIL,
  SET_FAILURE_OUTPUT,
  GET_SHOW_HELP_ON_FAIL,
  RESET_USAGE,
  FREEZE_USAGE,
  UNFREEZE_USAGE
}
