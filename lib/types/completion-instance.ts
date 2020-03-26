import { Parsed } from './parsed'
import { CompletionFunction } from './completion-function'

/** Instance of the completion module. */
export interface CompletionInstance {
  completionKey: string
  generateCompletionScript ($0: string, cmd: string): string
  getCompletion (args: string[], done: (completions: string[]) => any): any
  registerFunction(fn: CompletionFunction): void
  setParsed (parsed: Parsed): void
}
