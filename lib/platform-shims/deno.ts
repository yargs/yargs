
/* global Deno */

import { assertNotEquals, assertStrictEquals } from 'https://deno.land/std/testing/asserts.ts'
import { basename, dirname, extname, posix } from 'https://deno.land/std/path/mod.ts'
import { sprintf } from 'https://deno.land/std/fmt/printf.ts'

import cliui from 'https://deno.land/x/cliui@v7.0.0-deno/deno.ts'
import escalade from 'https://deno.land/x/escalade@v3.0.3/sync.ts'
import Parser from 'https://deno.land/x/yargs_parser@v19.0.1-deno/deno.ts'
import { YError } from '../../build/lib/yerror.js'

const REQUIRE_ERROR = 'require is not supported by ESM'
const REQUIRE_DIRECTORY_ERROR = 'loading a directory of commands is not supported yet for ESM'

// Deno removes argv[0] and argv[1 from Deno.args:
const argv = ['deno run', ...Deno.args]

// Yargs supports environment variables with prefixes, e.g., MY_APP_FOO,
// MY_APP_BAR. Environment variables are also used to detect locale.
let cwd: string = ''
let env: {[key: string]: string} = {}
try {
  cwd = Deno.cwd()
  env = Deno.env.toObject()
} catch (err) {
  if (err.name !== 'PermissionDenied') {
    throw err
  }
}

const path = {
  basename: basename,
  dirname: dirname,
  extname: extname,
  relative: (p1: string, p2: string) => {
    try {
      return posix.relative(p1, p2)
    } catch (err) {
      // Some yargs featuers require read access to the file system,
      // e.g., support for multiple locales.
      if (err.name !== 'PermissionDenied') {
        throw err
      }
      return p1
    }
  },
  resolve: posix.resolve
}

// TODO: replace with Deno.consoleSize(Deno.stdout.rid)
// once this feature is stable:
const columns = 80

export default {
  assert: {
    notStrictEqual: assertNotEquals,
    strictEqual: assertStrictEquals
  },
  cliui,
  findUp: escalade,
  getEnv: (key: string) => {
    return env[key]
  },
  inspect: Deno.inspect,
  getCallerFile: () => undefined,
  getProcessArgvBin: () => {
    return 'deno'
  },
  mainFilename: cwd,
  Parser,
  path,
  process: {
    argv: () => argv,
    cwd: () => cwd,
    execPath: () => {
      try {
        return Deno.execPath()
      } catch (_err) {
        return 'deno'
      }
    },
    exit: Deno.exit,
    nextTick: window.queueMicrotask,
    stdColumns: columns ?? null
  },
  readFileSync: Deno.readTextFileSync,
  require: () => {
    throw new YError(REQUIRE_ERROR)
  },
  requireDirectory: () => {
    throw new YError(REQUIRE_DIRECTORY_ERROR)
  },
  stringWidth: (str: string) => {
    return [...str].length
  },
  y18n: {
    __: (...str: string[]) => {
      if (str.length === 0) return ''
      const args = str.slice(1)
      return sprintf(str[0], ...args)
    },
    __n: (str1: string, str2: string, count: number, ...args: string[]) => {
      if (count === 1) {
        return sprintf(str1, ...args)
      } else {
        return sprintf(str2, ...args)
      }
    },
    getLocale: (): string => {
      return 'en_US'
    },
    setLocale: () => {},
    updateLocale: () => {}
  }
}
