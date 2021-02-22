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
