const SET_SHOW_HELP_ON_FAIL = 'SET_SHOW_HELP_ON_FAIL'
const GET_SHOW_HELP_ON_FAIL = 'GET_SHOW_HELP_ON_FAIL'
const RESET_USAGE = 'RESET_USAGE'

function setShowHelpOnFail (enabled, message) {
  return {
    type: SET_SHOW_HELP_ON_FAIL,
    enabled,
    message
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

module.exports = {
  setShowHelpOnFail,
  getShowHelpOnFail,
  resetUsage,
  SET_SHOW_HELP_ON_FAIL,
  GET_SHOW_HELP_ON_FAIL,
  RESET_USAGE
}
