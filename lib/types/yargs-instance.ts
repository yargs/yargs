import { Context } from './context'
import { Dictionary } from './dictionary'
import { LoggerInstance } from './logger-instance'
import { Options } from './options'
import { Parsed } from './parsed'
import { ParserConfiguration } from './parser-configuration'
import { YError } from '../yerror'
import yargsParser = require('yargs-parser')

/** Instance of the yargs module. */
export interface YargsInstance {
  $0: string
  argv: Parsed
  customScriptName: boolean
  parsed: yargsParser.DetailedArguments
  _getLoggerInstance (): LoggerInstance
  _hasParseCallback (): boolean
  array (key: string): YargsInstance
  boolean (key: string): YargsInstance
  count (key: string): YargsInstance
  demandOption (key: string, msg: string): YargsInstance
  exit (code: number, err?: YError): void
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
  normalize (key: string): YargsInstance
  number (key: string): YargsInstance
  parse (args: string[], shortCircuit: boolean): Parsed
  reset (): YargsInstance
  showHelp (level: string): YargsInstance
  string (key: string): YargsInstance
}
