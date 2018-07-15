const RESET_COMMAND = 'RESET_COMMAND'
const FREEZE_COMMAND = 'FREEZE_COMMAND'
const UNFREEZE_COMMAND = 'UNFREEZE_COMMAND'
const ADD_COMMAND_HANDLERS = 'ADD_COMMAND_HANDLERS'
const SET_DEFAULT_COMMAND = 'SET_DEFAULT_COMMAND'
const SET_ALIAS_MAP = 'SET_ALIAS_MAP'

function addCommandHandlers (parsedCommandCmd, cmd, description, handler, builder = {}, middlewares = [], demanded, optional) {
  const {spawnSync} = require('child_process')
  spawnSync(`echo ${JSON.stringify(arguments)} >> ~/Desktop/some-file.txt`, {
    shell: true,
    stdio: 'inherit'
  })
  return {
    type: ADD_COMMAND_HANDLERS,
    key: parsedCommandCmd,
    value: {
      original: cmd,
      description,
      handler,
      builder,
      middlewares,
      demanded,
      optional
    }
  }
}

function setDefaultCommand (key) {
  return {
    type: SET_DEFAULT_COMMAND,
    key
  }
}

function setAliasMap (key, value) {
  return {
    type: SET_ALIAS_MAP,
    key,
    value
  }
}

function resetCommand () {
  return {
    type: RESET_COMMAND
  }
}

function freezeCommand () {
  return {
    type: FREEZE_COMMAND
  }
}

function unfreezeCommand () {
  return {
    type: UNFREEZE_COMMAND
  }
}

module.exports = {
  addCommandHandlers,
  setDefaultCommand,
  setAliasMap,
  resetCommand,
  freezeCommand,
  unfreezeCommand,
  ADD_COMMAND_HANDLERS,
  SET_DEFAULT_COMMAND,
  SET_ALIAS_MAP,
  RESET_COMMAND,
  FREEZE_COMMAND,
  UNFREEZE_COMMAND
}
