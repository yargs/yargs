import { CompletionFunction, SyncCompletionFunction } from '../types'

export function isSyncCompletionFunction (completionFunction: CompletionFunction): completionFunction is SyncCompletionFunction {
  return completionFunction.length < 3
}
