import { notStrictEqual } from 'assert'

export type Dictionary<T = any> = { [key: string]: T }

export type NotEmptyArray<T = any> = [T, ...T[]]

/**
 * Returns the type of a Dictionary or array values.
 */
export type ValueOf<T> = T extends (infer U)[] ? U : T[keyof T];

/**
 * Typing wraper around assert.notStrictEqual()
 */
export function assertNotStrictEqual<N, T> (actual: T|N, expected: N, message ?: string | Error)
: asserts actual is Exclude<T, N> {
  notStrictEqual(actual, expected, message)
}

/**
 * Asserts actual is neither a Dictionary nor an array.
 */
export function assertSingleKey (actual: string | string[] | Dictionary): asserts actual is string {
  notStrictEqual(typeof actual, 'object')
}
