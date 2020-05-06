import { CommandInstance } from './command'
import { Dictionary } from './common-types'
import { Arguments, DetailedArguments, Configuration } from 'yargs-parser'
import { YError } from './yerror'
import { UsageInstance } from './usage'

/** Instance of the yargs module. */
export interface YargsInstance {
  $0: string
  argv: Arguments
  customScriptName: boolean
  parsed: DetailedArguments
  _copyDoubleDash (argv: Arguments): void
  _getLoggerInstance (): LoggerInstance
  _getParseContext(): Object
  _hasOutput (): boolean
  _hasParseCallback (): boolean
  // TODO: to be precised once yargs is tsified
  _parseArgs (args: null, shortCircuit: null, _calledFromCommand: boolean, commandIndex: number): Arguments
  _runValidation (argv: Arguments, aliases: Dictionary<string[]>, positionalMap: Dictionary<string[]>, parseErrors: Error | null): void
  _setHasOutput (): void
  array (key: string): YargsInstance
  boolean (key: string): YargsInstance
  count (key: string): YargsInstance
  demandOption (key: string, msg: string): YargsInstance
  exit (code: number, err?: YError | string): void
  getCommandInstance (): CommandInstance
  getContext (): Context
  getDemandedOptions (): Dictionary<string>
  getDemandedCommands (): Dictionary<{
    min: number
    max: number,
    minMsg?: string | null,
    maxMsg?: string | null
  }>
  getDeprecatedOptions (): Dictionary<string | boolean>
  getExitProcess (): boolean
  getGroups (): Dictionary<string[]>
  getHandlerFinishCommand (): (handlerResult: any) => any
  getOptions (): Options
  getParserConfiguration (): ParserConfiguration
  getUsageInstance (): UsageInstance
  global (globals: string | string[], global?: boolean): YargsInstance
  normalize (key: string): YargsInstance
  number (key: string): YargsInstance
  option (key: string, opt: OptionDefinition): YargsInstance
  parse (args: string[], shortCircuit: boolean): Arguments
  reset (aliases?: DetailedArguments['aliases']): YargsInstance
  showHelp (level: string): YargsInstance
  string (key: string): YargsInstance
}

export function isYargsInstance (y: YargsInstance | void): y is YargsInstance {
  return !!y && (typeof y._parseArgs === 'function')
}

/** Yargs' context. */
interface Context {
  commands: string[]
  // TODO: to be precised once yargs is tsified
  files: {}[]
  fullCommands: string[]
}

type LoggerInstance = Pick<Console, 'error' | 'log'>

export interface Options {
  array: string[]
  alias: Dictionary<string[]>
  boolean: string[]
  choices: Dictionary<string[]>
  // TODO: to be precised once yargs is tsified
  config: {}
  configuration: ParserConfiguration
  count: string[]
  default: Dictionary
  defaultDescription: Dictionary<string | undefined>
  hiddenOptions: string[]
  /** Manually set keys */
  key: Dictionary<boolean>
  normalize: string[]
  number: string[]
  showHiddenOpt: string
  string: string[]
}

interface ParserConfiguration extends Configuration {
  /** Should command be sorted in help */
  'sort-commands': boolean
}

export interface OptionDefinition {
  // TODO: to be precised once yargs is tsified
}
