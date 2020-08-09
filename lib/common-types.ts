import { notStrictEqual, strictEqual } from 'assert'

/**
 * An object whose all properties have the same type.
 */
export type Dictionary<T = any> = { [key: string]: T }

/**
 * Returns the keys of T that match Dictionary<U> and are not arrays.
 */
export type DictionaryKeyof<T, U = any> = Exclude<KeyOf<T, Dictionary<U>>, KeyOf<T, any[]>>

/**
 * Returns the keys of T that match U.
 */
export type KeyOf<T, U> = Exclude<{ [K in keyof T]: T[K] extends U ? K : never }[keyof T], undefined>

/**
 * An array whose first element is not undefined.
 */
export type NotEmptyArray<T = any> = [T, ...T[]]

/**
 * Returns the type of a Dictionary or array values.
 */
export type ValueOf<T> = T extends (infer U)[] ? U : T[keyof T];

/**
 * Typing wrapper around assert.notStrictEqual()
 */
export function assertNotStrictEqual<N, T> (actual: T|N, expected: N, message ?: string | Error)
: asserts actual is Exclude<T, N> {
  notStrictEqual(actual, expected, message)
}

/**
 * Asserts actual is a single key, not a key array or a key map.
 */
export function assertSingleKey (actual: string | string[] | Dictionary): asserts actual is string {
  strictEqual(typeof actual, 'string')
}

/**
 * Typing wrapper around Object.keys()
 */
export function objectKeys<T> (object: T) {
  return Object.keys(object) as (keyof T)[]
}

export interface RequireDirectoryOptions {
  extensions?: ReadonlyArray<string>;
  visit?: (commandObject: any, pathToFile: string, filename?: string) => any;
  recurse?: boolean;
}

// Dependencies that might vary between CJS, ESM, and Deno are isolated:
export interface YargsMixin {
  mainFilename: string;
  Parser: ({
    camelcase: Function;
    detailed: Function;
    decamelize: Function;
  }),
  y18n: Y18N,
  findUp: Function,
  requireDirectory: Function
  stringWidth: Function;
  cliui: Function;
  require: RequireType;
}

export interface RequireType {
  (path: string): Function;
  main: MainType;
}

export interface MainType {
  filename: string;
  children: MainType[];
}

export interface Y18N {
  __(str: string, ...args: string[]): string;
  __n(str: string, ...args: (string|number)[]): string;
  getLocale(): string;
  setLocale(locale: string): void;
  updateLocale(obj: {[key: string]: string}): void;
}
