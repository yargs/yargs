import { argsert } from './argsert'
import { isPromise } from './is-promise'
import { YargsInstance } from './yargs-types'
import { Arguments } from 'yargs-parser'

export function globalMiddlewareFactory<T> (globalMiddleware: (Middleware | Middleware[])[], context: T) {
  return function (callback: MiddlewareCallback | MiddlewareCallback[], applyBeforeValidation = false) {
    argsert('<array|function> [boolean]', [callback, applyBeforeValidation], arguments.length)
    if (Array.isArray(callback)) {
      for (let i = 0; i < callback.length; i++) {
        if (typeof callback[i] !== 'function') {
          throw Error('middleware must be a function')
        }
        (callback[i] as Middleware).applyBeforeValidation = applyBeforeValidation
      }
      Array.prototype.push.apply(globalMiddleware, callback as Middleware[])
    } else if (typeof callback === 'function') {
      (callback as Middleware).applyBeforeValidation = applyBeforeValidation
      globalMiddleware.push(callback as Middleware)
    }
    return context
  }
}

export function commandMiddlewareFactory (commandMiddleware?: MiddlewareCallback[]): Middleware[] {
  if (!commandMiddleware) return []
  return commandMiddleware.map(middleware => {
    (middleware as Middleware).applyBeforeValidation = false
    return middleware
  }) as Middleware[]
}

export function applyMiddleware (
  argv: Arguments,
  yargs: YargsInstance,
  middlewares: Middleware[],
  beforeValidation: boolean
) {
  const beforeValidationError = new Error('middleware cannot return a promise when applyBeforeValidation is true')
  return middlewares
    .reduce<Arguments | Promise<Arguments>>((accumulation, middleware) => {
      if (middleware.applyBeforeValidation !== beforeValidation) {
        return accumulation
      }

      if (isPromise(accumulation)) {
        return accumulation
          .then(initialObj =>
            Promise.all<Arguments, Partial<Arguments>>([initialObj, middleware(initialObj, yargs)])
          )
          .then(([initialObj, middlewareObj]) =>
            Object.assign(initialObj, middlewareObj)
          )
      } else {
        const result = middleware(argv, yargs)
        if (beforeValidation && isPromise(result)) throw beforeValidationError

        return isPromise(result)
          ? result.then(middlewareObj => Object.assign(accumulation, middlewareObj))
          : Object.assign(accumulation, result)
      }
    }, argv)
}

interface MiddlewareCallback {
  (argv: Arguments, yargs: YargsInstance): Partial<Arguments> | Promise<Partial<Arguments>>
}

interface Middleware extends MiddlewareCallback {
  applyBeforeValidation: boolean
}
