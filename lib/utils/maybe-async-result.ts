// maybeAsyncResult() allows the same error/completion handler to be
// applied to a value regardless of whether it is a concrete value or an
// eventual value.
//
// As of yargs@v17, if no asynchronous steps are run, .e.g, a
// check() script that resolves a promise, yargs will return a concrete
// value. If any asynchronous steps are introduced, yargs resolves a promise.
import {isPromise} from './is-promise.js';
export function maybeAsyncResult<T>(
  getResult: (() => T | Promise<T>) | T | Promise<T>,
  errorHandler: (err: Error) => T,
  resultHandler: (result: T) => T | Promise<T>
): T | Promise<T> {
  try {
    const result = isFunction(getResult) ? getResult() : getResult;
    if (isPromise(result)) {
      return result.then((result: T) => {
        return resultHandler(result);
      });
    } else {
      return resultHandler(result);
    }
  } catch (err) {
    return errorHandler(err);
  }
}

function isFunction(arg: (() => any) | any): arg is () => any {
  return typeof arg === 'function';
}
