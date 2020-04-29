import { Dictionary } from './dictionary'

export interface FrozenUsageInstance {
  failMessage: string | undefined | null
  failureOutput: boolean
  usages: [string, string][]
  usageDisabled: boolean
  epilogs: string[]
  examples: [string, string][]
  commands: [string, string, boolean, string[], boolean][]
  descriptions: Dictionary<string | undefined>
}
