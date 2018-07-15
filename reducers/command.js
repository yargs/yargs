const {
  ADD_COMMAND_HANDLERS,
  SET_DEFAULT_COMMAND,
  SET_ALIAS_MAP,
  RESET_COMMAND,
  FREEZE_COMMAND,
  UNFREEZE_COMMAND
} = require('../actions/command')
const initialState = {
  handlers: {},
  aliasMap: {},
  defaultCommand: undefined
}

function addCommandHandlers (state = initialState, key, value) {
  // const test = Object.assign({}, state, {handlers: {...JSON.parse(JSON.stringify(state.handlers)), [key]: value}})
  // console.log('action command: ', JSON.stringify(test))
  return Object.assign({}, state, {handlers: {...state.handlers, [key]: value}})
}

function setDefaultCommand (state = initialState, key) {
  // const test = Object.assign({}, state, {handlers: {...JSON.parse(JSON.stringify(state.handlers)), [key]: value}})
  // console.log('action command: ', JSON.stringify(test))
  return {...state, defaultCommand: state.handlers[key]}
}

function setAliasMap (state = initialState, key, value) {
  // const test = Object.assign({}, state, {handlers: {...JSON.parse(JSON.stringify(state.handlers)), [key]: value}})
  // console.log('action command: ', JSON.stringify(test))
  return {...state, aliasMap: {...state.aliasMap, [key]: value}}
}

function resetCommand (state = initialState) {
  return {
    handlers: {},
    aliasMap: {},
    defaultCommand: undefined,
    frozen: state.frozen
  }
}

function freezeCommand (state = initialState) {
  return Object.assign({}, state, {
    frozen: {
      handlers: {...state.handlers},
      aliasMap: {...state.aliasMap},
      defaultCommand: state.defaultCommand
    }
  })
}

function unfreezeCommand (state = initialState) {
  const nextState = Object.assign({}, state, state.frozen)
  delete nextState.frozen
  return nextState
}

module.exports = function commandReducer (state = initialState, action) {
  switch (action.type) {
    case ADD_COMMAND_HANDLERS:
      return addCommandHandlers(state, action.key, action.value)
    case SET_DEFAULT_COMMAND:
      return setDefaultCommand(state, action.key)
    case SET_ALIAS_MAP:
      return setAliasMap(state, action.key, action.value)
    case RESET_COMMAND:
      return resetCommand(state)
    case FREEZE_COMMAND:
      return freezeCommand(state)
    case UNFREEZE_COMMAND:
      return unfreezeCommand(state)
    default:
      return state
  }
}
