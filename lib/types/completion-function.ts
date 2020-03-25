import { Parsed } from './parsed'

export type CompletionFunction = SyncCompletionFunction | AsyncCompletionFunction

export interface SyncCompletionFunction {
  (current: string, argv: Parsed): string[] | Promise<string[]>
}

export interface AsyncCompletionFunction {
  (current: string, argv: Parsed, done: (completions: string[]) => any): any
}
