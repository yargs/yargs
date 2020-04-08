import { Positional } from './positional'

export interface ParsedCommand {
  cmd: string
  demanded: Positional[]
  optional: Positional[]
}
