import { Dictionary } from './dictionary'
import { FailureFunction } from './failure-function'
import { YError } from '../yerror'

/** Instance of the usage module. */
export interface UsageInstance {
  cacheHelpMessage (): void
  clearCachedHelpMessage (): void
  command (cmd: string, description: string | undefined, isDefault: boolean, aliases: string[]): void
  deferY18nLookup (str: string): string
  describe (key: string, desc?: string): void
  describe (keys: Dictionary<string>): void
  epilog (msg: string): void
  example (cmd: string, description?: string): void
  fail (msg?: string | null, err?: YError | string): void
  failFn (f: FailureFunction): void
  freeze (): void
  functionDescription (fn: { name?: string }): string
  getCommands (): [string, string, boolean, string[]][]
  getDescriptions (): Dictionary<string | undefined>
  getPositionalGroupName (): string
  getUsage (): [string, string][]
  getUsageDisabled (): boolean
  help (): string
  reset (localLookup: Dictionary<boolean>): UsageInstance
  showHelp (level: 'error' | 'log'): void
  showHelp (level: (message: string) => void): void
  showHelpOnFail (message?: string): UsageInstance
  showHelpOnFail (enabled: boolean, message: string): UsageInstance
  showVersion (): void
  stringifiedValues (values?: any[], separator?: string): string
  unfreeze (): void
  usage (msg: string | null, description?: string): UsageInstance
  version (ver: any): void
  wrap (cols: number): void
}
