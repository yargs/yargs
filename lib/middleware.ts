import { argsert } from './argsert'
import { isPromise } from './is-promise'
import { YargsInstance, Arguments } from './yargs'

export function globalMiddlewareFactory<C, T> (globalMiddleware: Middleware<T>[], context: C) {
  return function (callback: MiddlewareCallback<T> | MiddlewareCallback<T>[], applyBeforeValidation = false) {
    argsert('<array|function> [boolean]', [callback, applyBeforeValidation], arguments.length)
    if (Array.isArray(callback)) {
      for (let i = 0; i < callback.length; i++) {
        if (typeof callback[i] !== 'function') {
          throw Error('middleware must be a function')
        }
        (callback[i] as Middleware<T>).applyBeforeValidation = applyBeforeValidation
      }
      Array.prototype.push.apply(globalMiddleware, callback as Middleware<T>[])
    } else if (typeof callback === 'function') {
      (callback as Middleware<T>).applyBeforeValidation = applyBeforeValidation
      globalMiddleware.push(callback as Middleware<T>)
    }
    return context
  }
}

export function commandMiddlewareFactory<T> (commandMiddleware?: MiddlewareCallback<T>[]): Middleware<T>[] {
  if (!commandMiddleware) return []
  return commandMiddleware.map(middleware => {
    (middleware as Middleware<T>).applyBeforeValidation = false
    return middleware
  }) as Middleware<T>[]
}

export function applyMiddleware<T> (
  argv: Arguments | Promise<Arguments>,
  yargs: YargsInstance<T>,
  middlewares: Middleware<T>[],
  beforeValidation: boolean
) {
  const beforeValidationError = new Error('middleware cannot return a promise when applyBeforeValidation is true')
  return middlewares
    .reduce<Arguments | Promise<Arguments>>((acc, middleware) => {
      if (middleware.applyBeforeValidation !== beforeValidation) {
        return acc
      }

      if (isPromise(acc)) {
        return acc
          .then(initialObj =>
            Promise.all<Arguments, Partial<Arguments>>([initialObj, middleware(initialObj, yargs)])
          )
          .then(([initialObj, middlewareObj]) =>
            Object.assign(initialObj, middlewareObj)
          )
      } else {
        const result = middleware(acc, yargs)
        if (beforeValidation && isPromise(result)) throw beforeValidationError

        return isPromise(result)
          ? result.then(middlewareObj => Object.assign(acc, middlewareObj))
          : Object.assign(acc, result)
      }
    }, argv)
}

export interface MiddlewareCallback<T> {
  (argv: Arguments, yargs: YargsInstance<T>): Partial<Arguments> | Promise<Partial<Arguments>>
}

export interface Middleware<T> extends MiddlewareCallback<T> {
  applyBeforeValidation: boolean
}
