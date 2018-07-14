const ADD_COMMAND_HANDLERS = 'ADD_COMMAND_HANDLERS'
const ADD_COMMAND = 'ADD_COMMAND'

function addCommand (value) {
  return {
    type: ADD_COMMAND,
    value
  }
}

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
      cmd,
      description,
      handler,
      builder,
      middlewares,
      demanded,
      optional
    }
  }
}

module.exports = {
  ADD_COMMAND_HANDLERS,
  ADD_COMMAND,
  addCommandHandlers,
  addCommand
}
