import { CustomCheck } from './custom-check'
import { Dictionary } from './dictionary'
import { KeyOrPos } from './key-or-pos'
import { Arguments, DetailedArguments } from 'yargs-parser'

/** Instance of the validation module. */
export interface ValidationInstance {
  check (f: CustomCheck['func'], global: boolean): void
  conflicting (argv: Arguments): void
  conflicts (key: string, value: string | string[]): void
  conflicts (key: Dictionary<string | string[]>): void
  customChecks (argv: Arguments, aliases: DetailedArguments['aliases']): void
  freeze (): void
  getConflicting (): Dictionary<(string | undefined)[]>
  getImplied (): Dictionary<KeyOrPos[]>
  implications (argv: Arguments): void
  implies (key: string, value: KeyOrPos | KeyOrPos[]): void
  implies (key: Dictionary<KeyOrPos | KeyOrPos[]>): void
  isValidAndSomeAliasIsNotNew (key: string, aliases: DetailedArguments['aliases']): boolean
  limitedChoices (argv: Arguments): void
  nonOptionCount (argv: Arguments): void
  positionalCount (required: number, observed: number): void
  recommendCommands (cmd: string, potentialCommands: string[]): void
  requiredArguments (argv: Arguments): void
  reset (localLookup: Dictionary): ValidationInstance
  unfreeze (): void
  unknownArguments (argv: Arguments, aliases: DetailedArguments['aliases'], positionalMap: Dictionary): void
  unknownCommands (argv: Arguments, aliases: DetailedArguments['aliases'], positionalMap: Dictionary): boolean
}
