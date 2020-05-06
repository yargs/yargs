import { notStrictEqual } from 'assert'

export type Dictionary<T = any> = { [key: string]: T }

export type NotEmptyArray<T = any> = [T, ...T[]]

export function assertNotTrue<T = any> (actual: T | true): asserts actual is T {
  notStrictEqual(actual, true)
}

export function assertNotUndefined<T = any> (actual: T | undefined): asserts actual is T {
  notStrictEqual(actual, undefined)
}
