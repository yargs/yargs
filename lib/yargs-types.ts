import { CommandInstance } from './command'
import { Dictionary } from './common-types'
import { Arguments, DetailedArguments, Configuration } from 'yargs-parser'
import { YError } from './yerror'

/** Instance of the yargs module. */
export interface YargsInstance {
  $0: string
  argv: Arguments
  customScriptName: boolean
  parsed: DetailedArguments
  _getLoggerInstance (): LoggerInstance
  _getParseContext(): Object
  _hasParseCallback (): boolean
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
  getOptions (): Options
  getParserConfiguration (): ParserConfiguration
  global (globals: string | string[], global?: boolean): YargsInstance
  normalize (key: string): YargsInstance
  number (key: string): YargsInstance
  parse (args: string[], shortCircuit: boolean): Arguments
  reset (): YargsInstance
  showHelp (level: string): YargsInstance
  string (key: string): YargsInstance
}

/** Yargs' context. */
interface Context {
  commands: string[]
}

type LoggerInstance = Pick<Console, 'error' | 'log'>

interface Options {
  array: string[]
  alias: Dictionary<string[]>
  boolean: string[]
  choices: Dictionary<string[]>
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
