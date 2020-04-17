import { Arguments } from 'yargs-parser'

export type CompletionFunction = SyncCompletionFunction | AsyncCompletionFunction

export interface SyncCompletionFunction {
  (current: string, argv: Arguments): string[] | Promise<string[]>
}

export interface AsyncCompletionFunction {
  (current: string, argv: Arguments, done: (completions: string[]) => any): any
}
