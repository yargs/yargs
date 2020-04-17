import { CompletionFunction } from './completion-function'
import { DetailedArguments } from 'yargs-parser'

/** Instance of the completion module. */
export interface CompletionInstance {
  completionKey: string
  generateCompletionScript ($0: string, cmd: string): string
  getCompletion (args: string[], done: (completions: string[]) => any): any
  registerFunction(fn: CompletionFunction): void
  setParsed (parsed: DetailedArguments): void
}
