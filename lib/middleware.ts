import { argsert } from './argsert'
import { isPromise } from './is-promise'
import { YargsInstance, Arguments } from './yargs'

export function globalMiddlewareFactory<C, R> (globalMiddleware: Middleware<R>[], context: C) {
  return function (callback: MiddlewareCallback<R> | MiddlewareCallback<R>[], applyBeforeValidation = false) {
    argsert('<array|function> [boolean]', [callback, applyBeforeValidation], arguments.length)
    if (Array.isArray(callback)) {
      for (let i = 0; i < callback.length; i++) {
        if (typeof callback[i] !== 'function') {
          throw Error('middleware must be a function')
        }
        (callback[i] as Middleware<R>).applyBeforeValidation = applyBeforeValidation
      }
      Array.prototype.push.apply(globalMiddleware, callback as Middleware<R>[])
    } else if (typeof callback === 'function') {
      (callback as Middleware<R>).applyBeforeValidation = applyBeforeValidation
      globalMiddleware.push(callback as Middleware<R>)
    }
    return context
  }
}

export function commandMiddlewareFactory<R> (commandMiddleware?: MiddlewareCallback<R>[]): Middleware<R>[] {
  if (!commandMiddleware) return []
  return commandMiddleware.map(middleware => {
    (middleware as Middleware<R>).applyBeforeValidation = false
    return middleware
  }) as Middleware<R>[]
}

export function applyMiddleware<R> (
  argv: Arguments | Promise<Arguments>,
  yargs: YargsInstance<R>,
  middlewares: Middleware<R>[],
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

export interface MiddlewareCallback<R> {
  (argv: Arguments, yargs: YargsInstance<R>): Partial<Arguments> | Promise<Partial<Arguments>>
}

export interface Middleware<R> extends MiddlewareCallback<R> {
  applyBeforeValidation: boolean
}
