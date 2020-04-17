import { Arguments, DetailedArguments } from 'yargs-parser'

export interface CustomCheck {
  func: (argv: Arguments, aliases: DetailedArguments['aliases']) => any
  global: boolean
}
