'use strict'
import * as Hash from 'hashish'
import { CheckOutputResult } from '../types'

// capture terminal output, so that we might
// assert against it.
export function checkOutput<T> (f: () => T, argv?: string[]): CheckOutputResult<T>
export function checkOutput<T>(f: () => T, argv: string[] | undefined, cb: (err: Error | null, result: CheckOutputResult<T>) => any): void
export function checkOutput<T> (
  f: () => T,
  argv?: string[],
  cb?: (err: Error | null, result: CheckOutputResult<T>) => any
): CheckOutputResult<T> | void {
  let exit = false
  const _exit = process.exit
  const _emit = process.emit
  const _env = process.env
  const _argv = process.argv
  const _error = console.error
  const _log = console.log
  const _warn = console.warn

  process.exit = (() => { exit = true }) as NodeJS.Process['exit']
  process.env = Hash.merge(process.env, { _: 'node' })
  process.argv = argv || ['./usage']

  const errors: any[] = []
  const logs: any[] = []
  const warnings: any[] = []

  console.error = (msg) => { errors.push(msg) }
  console.log = (msg) => { logs.push(msg) }
  console.warn = (msg) => { warnings.push(msg) }

  let result: T

  if (typeof cb === 'function') {
    process.exit = (() => {
      exit = true
      cb(null, done())
    }) as NodeJS.Process['exit']
    process.emit = function emit (this: NodeJS.Process, ev: string, value: any) {
      if (ev === 'uncaughtException') {
        cb(value, done())
        return true
      }

      return _emit.apply(this, arguments as any)
    } as NodeJS.Process['emit']

    f()
  } else {
    try {
      result = f()
    } finally {
      reset()
    }

    return done()
  }

  function reset () {
    process.exit = _exit
    process.emit = _emit
    process.env = _env
    process.argv = _argv

    console.error = _error
    console.log = _log
    console.warn = _warn
  }

  function done (): CheckOutputResult<T> {
    reset()

    return {
      errors,
      logs,
      warnings,
      exit,
      result
    }
  }
}
