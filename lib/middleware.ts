import {argsert} from './argsert.js';
import {isPromise} from './utils/is-promise.js';
import {YargsInstance, Arguments} from './yargs-factory.js';

export function globalMiddlewareFactory<T>(
  globalMiddleware: Middleware[],
  context: T
) {
  return function (
    callback: MiddlewareCallback | MiddlewareCallback[],
    applyBeforeValidation = false
  ) {
    argsert(
      '<array|function> [boolean]',
      [callback, applyBeforeValidation],
      arguments.length
    );
    if (Array.isArray(callback)) {
      for (let i = 0; i < callback.length; i++) {
        if (typeof callback[i] !== 'function') {
          throw Error('middleware must be a function');
        }
        (callback[
          i
        ] as Middleware).applyBeforeValidation = applyBeforeValidation;
      }
      Array.prototype.push.apply(globalMiddleware, callback as Middleware[]);
    } else if (typeof callback === 'function') {
      (callback as Middleware).applyBeforeValidation = applyBeforeValidation;
      globalMiddleware.push(callback as Middleware);
    }
    return context;
  };
}

export function commandMiddlewareFactory(
  commandMiddleware?: MiddlewareCallback[]
): Middleware[] {
  if (!commandMiddleware) return [];
  return commandMiddleware.map(middleware => {
    (middleware as Middleware).applyBeforeValidation = false;
    return middleware;
  }) as Middleware[];
}

export function applyMiddleware(
  argv: Arguments | Promise<Arguments>,
  yargs: YargsInstance,
  middlewares: Middleware[],
  beforeValidation: boolean
) {
  const beforeValidationError = new Error(
    'middleware cannot return a promise when applyBeforeValidation is true'
  );
  return middlewares.reduce<Arguments | Promise<Arguments>>(
    (acc, middleware) => {
      if (middleware.applyBeforeValidation !== beforeValidation) {
        return acc;
      }

      if (isPromise(acc)) {
        return acc
          .then(initialObj =>
            Promise.all<Arguments, Partial<Arguments>>([
              initialObj,
              middleware(initialObj, yargs),
            ])
          )
          .then(([initialObj, middlewareObj]) =>
            Object.assign(initialObj, middlewareObj)
          );
      } else {
        const result = middleware(acc, yargs);
        if (beforeValidation && isPromise(result)) throw beforeValidationError;

        return isPromise(result)
          ? result.then(middlewareObj => Object.assign(acc, middlewareObj))
          : Object.assign(acc, result);
      }
    },
    argv
  );
}

export interface MiddlewareCallback {
  (argv: Arguments, yargs: YargsInstance):
    | Partial<Arguments>
    | Promise<Partial<Arguments>>;
}

export interface Middleware extends MiddlewareCallback {
  applyBeforeValidation: boolean;
}
