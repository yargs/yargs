import { isPromise } from './is-promise.js';
export function maybeAsyncResult(getResult, resultHandler, errorHandler = (err) => {
    throw err;
}) {
    try {
        const result = isFunction(getResult) ? getResult() : getResult;
        if (isPromise(result)) {
            return result.then((result) => {
                return resultHandler(result);
            });
        }
        else {
            return resultHandler(result);
        }
    }
    catch (err) {
        return errorHandler(err);
    }
}
function isFunction(arg) {
    return typeof arg === 'function';
}
