import { Dictionary } from './dictionary'

/** Instance of the usage module. */
export interface UsageInstance {
  getCommands (): string[]
  getDescriptions (): Dictionary<string>
}
