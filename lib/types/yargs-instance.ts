import { CommandInstance } from './command-instance'
import { Context } from './context'
import { Dictionary } from './dictionary'
import { LoggerInstance } from './logger-instance'
import { Options } from './options'
import { ParserConfiguration } from './parser-configuration'
import { YError } from '../yerror'
import { Arguments, DetailedArguments } from 'yargs-parser'

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
