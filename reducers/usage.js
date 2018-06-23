const objFilter = require('../lib/obj-filter')

const {
  SET_SHOW_HELP_ON_FAIL,
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
  UNFREEZE_USAGE,
  SET_FAILURE_OUTPUT
} = require('../actions/usage')
const initialState = {
  failMessage: null,
  showHelpOnFail: true,
  failureOutput: false,
  epilog: undefined,
  usageDisabled: false,
  commands: [],
  examples: [],
  descriptions: {},
  usages: []
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
  return Object.assign({}, state, { usages: [...value] })
}

function setCommands (state = initialState, value) {
  return Object.assign({}, state, { commands: [...value] })
}

function setExamples (state = initialState, value) {
  return Object.assign({}, state, { examples: [...value] })
}

function setDescriptions (state = initialState, value) {
  return Object.assign({}, state, { descriptions: Object.assign({}, value) })
}

function addUsages (state = initialState, msg, description) {
  return Object.assign({}, state, { usages: [...state.usages, [msg, description]] })
}

function addCommand (state = initialState, cmd, description = '', isDefault, aliases) {
  let commands = [...state.commands]
  // the last default wins, so cancel out any previously set default
  if (isDefault) {
    commands = commands.map((cmdArray) => {
      return [...cmdArray.slice(0, 2), false, ...cmdArray.slice(3)]
    })
  }
  return Object.assign({}, state, {commands: [...commands, [cmd, description, isDefault, aliases]]})
}

function addExample (state = initialState, cmd, description) {
  return Object.assign({}, state, {examples: [...state.examples, [cmd, description]]})
}

function addDescription (state = initialState, key, description) {
  return Object.assign({}, state, {
    descriptions: Object.assign({}, state.descriptions, {[key]: description})
  })
}

function resetUsage (state = initialState, localLookup) {
  return {
    failMessage: null,
    showHelpOnFail: true,
    failureOutput: false,
    epilog: undefined,
    usageDisabled: false,
    usages: [],
    commands: [],
    examples: [],
    descriptions: objFilter(state.descriptions, (k, v) => !localLookup[k]),
    frozen: state.frozen
  }
}

function freezeUsage (state = initialState) {
  return Object.assign({}, state, {
    frozen: {
      failMessage: state.failMessage,
      showHelpOnFail: state.showHelpOnFail,
      failureOutput: state.failureOutput,
      usages: state.usages.slice(),
      commands: state.commands.slice(),
      examples: state.examples.slice(),
      descriptions: Object.assign({}, state.descriptions),
      usageDisabled: state.usageDisabled,
      epilog: state.epilog
    }
  })
}

function unfreezeUsage (state = initialState) {
  const nextState = Object.assign({}, state, state.frozen)
  delete nextState.frozen
  return nextState
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
    case SET_EXAMPLES:
      return setExamples(state, action.value)
    case SET_COMMANDS:
      return setCommands(state, action.value)
    case SET_DESCRIPTIONS:
      return setDescriptions(state, action.value)
    case ADD_USAGES:
      return addUsages(state, action.msg, action.description)
    case ADD_COMMAND:
      return addCommand(state, action.cmd, action.description, action.isDefault, action.aliases)
    case ADD_EXAMPLE:
      return addExample(state, action.cmd, action.description)
    case ADD_DESCRIPTION:
      return addDescription(state, action.key, action.description)
    case RESET_USAGE:
      return resetUsage(state, action.localLookup)
    case FREEZE_USAGE:
      return freezeUsage(state)
    case UNFREEZE_USAGE:
      return unfreezeUsage(state)
    default:
      return state
  }
}
