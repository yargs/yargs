import { Context } from './context'
import { Options } from './options'
import { Parsed } from './parsed'

/** Instance of the yargs module. */
export interface YargsInstance {
  argv: Parsed
  getContext (): Context
  getOptions (): Options
  parse (args: string[], shortCircuit: boolean): Parsed
  reset (): YargsInstance
}
