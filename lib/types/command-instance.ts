import { CommandHandler } from './command-handler'
import { Dictionary } from './dictionary'

/** Instance of the command module. */
export interface CommandInstance {
  getCommandHandlers (): Dictionary<CommandHandler>
}
