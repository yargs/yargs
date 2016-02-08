// handles parsing positional arguments,
// and populating argv with said positional
// arguments.
module.exports = function (yargs, usage) {
  var self = {}

  var handlers = {}
  self.addHandler = function (cmd, description, builder, handler) {
    if (description !== false) {
      usage.command(cmd, description)
    }

    // we should not register a handler if no
    // builder is provided, e.g., user will
    // handle command themselves with '_'.
    if (builder) {
      var parsedCommand = parseCommand(cmd)
      handlers[parsedCommand.cmd] = {
        handler: handler,
        builder: builder,
        demanded: parsedCommand.demanded,
        optional: parsedCommand.optional
      }
    }
  }

  function parseCommand (cmd) {
    var splitCommand = cmd.split(/\s/)
    var bregex = /[\][<>]/g
    var parsedCommand = {
      cmd: (splitCommand.shift()).replace(bregex, ''),
      demanded: [],
      optional: []
    }
    splitCommand.forEach(function (cmd) {
      if (/^\[/.test(cmd)) parsedCommand.optional.push(cmd.replace(bregex, ''))
      else parsedCommand.demanded.push(cmd.replace(bregex, ''))
    })
    return parsedCommand
  }

  self.getCommands = function () {
    return Object.keys(handlers)
  }

  self.getCommandHandlers = function () {
    return handlers
  }

  self.runCommand = function (command, yargs, parsed) {
    var argv = parsed.argv
    var commandHandler = handlers[command]
    var innerArgv = argv
    if (commandHandler.builder) {
      innerArgv = commandHandler.builder(yargs.reset(parsed.aliases))
      innerArgv = innerArgv ? innerArgv.argv : argv
    }
    if (commandHandler.handler) {
      commandHandler.handler(innerArgv)
    }
    return innerArgv
  }

  self.reset = function () {
    handlers = {}
    return self
  }

  return self
}
