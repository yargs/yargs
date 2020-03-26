import { Dictionary } from './dictionary'

export interface Options {
  boolean: string[]
  configuration: Dictionary
  default: Dictionary
  /** Manually set keys */
  key: Dictionary<boolean>
}
