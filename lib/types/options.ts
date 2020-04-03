import { Dictionary } from './dictionary'
import { ParserConfiguration } from './parser-configuration'

export interface Options {
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
