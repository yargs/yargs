import { Dictionary } from './dictionary'
import { YargsInstance } from './yargs'

/** Instance of the command module. */
export interface CommandInstance {
  getCommandHandlers (): Dictionary<CommandHandler>
  getCommands (): string[]
}

interface CommandHandler {
  builder: CommandBuilder
}

// To be completed later with other CommandBuilder flavours
type CommandBuilder = FunctionCommandBuilder

interface FunctionCommandBuilder {
  (y: YargsInstance): YargsInstance
}

export function isFunctionCommandBuilder (builder: CommandBuilder): builder is FunctionCommandBuilder {
  return typeof builder === 'function'
}
