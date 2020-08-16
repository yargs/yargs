'use strict'

import { notStrictEqual, strictEqual } from 'assert'
import cliui from 'cliui'
import escalade from 'escalade/sync'
import { format, inspect } from 'util'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url';
import Parser from 'yargs-parser'
import { basename, dirname, extname, relative, resolve } from 'path'
import { getProcessArgvBin } from '../../build/lib/utils/process-argv.js'

// TODO: stop using createRequire before we ship ESM version of yargs:
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));

export default {
  assert: {
    notStrictEqual,
    strictEqual
  },
  cliui,
  findUp: escalade,
  getEnv: (key) => {
    return process.env[key]
  },
  inspect,
  getCallerFile: require('get-caller-file'),
  getProcessArgvBin,
  mainFilename: process.cwd(),
  Parser,
  path: {
    basename,
    dirname,
    extname,
    relative
  },
  process: {
    argv: () => process.argv,
    cwd: process.cwd,
    execPath: () => process.execPath,
    exit: process.exit,
    nextTick: process.nextTick,
    stdColumns: typeof process.stdout.columns !== 'undefined' ? process.stdout.columns : null
  },
  readFileSync,
  require,
  requireDirectory: require('require-directory'),
  stringWidth: (str) => {
    return [...str].length
  },
  // TODO: replace this with y18n once it's ported to ESM:
  y18n: {
    __: (...str) => {
      if (str.length === 0) return ''
      const args = str.slice(1)
      return format(str[0], ...args)
    },
    __n: (str1, str2, count, ...args) => {
      if (count === 1) {
        return format(str1, ...args)
      } else {
        return format(str2, ...args)
      }
    },
    getLocale: () => {
      return 'en_US'
    },
    setLocale: () => {},
    updateLocale: () => {}
  }
}
