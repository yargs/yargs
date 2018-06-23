const SET_SHOW_HELP_ON_FAIL = 'SET_SHOW_HELP_ON_FAIL'
const RESET_USAGE = 'RESET_USAGE'
const FREEZE_USAGE = 'FREEZE_USAGE'
const UNFREEZE_USAGE = 'UNFREEZE_USAGE'
const SET_FAILURE_OUTPUT = 'SET_FAILURE_OUTPUT'
const SET_USAGE_EPILOG = 'SET_USAGE_EPILOG'
const SET_USAGE_DISABLED = 'SET_USAGE_DISABLED'
const SET_USAGES = 'SET_USAGES'
const SET_COMMANDS = 'SET_COMMANDS'
const SET_EXAMPLES = 'SET_EXAMPLES'
const SET_DESCRIPTIONS = 'SET_DESCRIPTIONS'
const ADD_USAGES = 'ADD_USAGES'
const ADD_COMMAND = 'ADD_COMMAND'
const ADD_EXAMPLE = 'ADD_EXAMPLE'
const ADD_DESCRIPTION = 'ADD_DESCRIPTION'

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

function setCommands (value) {
  return {
    type: SET_COMMANDS,
    value
  }
}

function setExamples (value) {
  return {
    type: SET_EXAMPLES,
    value
  }
}

function setDescriptions (value) {
  return {
    type: SET_DESCRIPTIONS,
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

function addCommand (cmd, description = '', isDefault, aliases) {
  return {
    type: ADD_COMMAND,
    cmd,
    description,
    isDefault,
    aliases
  }
}

function addExample (cmd, description = '') {
  return {
    type: ADD_EXAMPLE,
    cmd,
    description
  }
}

function addDescription (key, description = '') {
  return {
    type: ADD_DESCRIPTION,
    key,
    description
  }
}

function resetUsage (localLookup) {
  return {
    type: RESET_USAGE,
    localLookup
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
  setCommands,
  setExamples,
  setDescriptions,
  addUsages,
  addCommand,
  addExample,
  addDescription,
  resetUsage,
  freezeUsage,
  unfreezeUsage,
  SET_SHOW_HELP_ON_FAIL,
  SET_FAILURE_OUTPUT,
  SET_USAGE_EPILOG,
  SET_USAGE_DISABLED,
  SET_USAGES,
  SET_COMMANDS,
  SET_EXAMPLES,
  SET_DESCRIPTIONS,
  ADD_USAGES,
  ADD_COMMAND,
  ADD_EXAMPLE,
  ADD_DESCRIPTION,
  RESET_USAGE,
  FREEZE_USAGE,
  UNFREEZE_USAGE
}
