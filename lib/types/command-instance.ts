import { CommandHandler } from './command-handler'
import { Dictionary } from './dictionary'
import { ParsedCommand } from './parsed-command'

/** Instance of the command module. */
export interface CommandInstance {
  getCommandHandlers (): Dictionary<CommandHandler>
  parseCommand (cmd: string): ParsedCommand
}
