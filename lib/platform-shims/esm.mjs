'use strict'

import { notStrictEqual, strictEqual } from 'assert'
import cliui from 'cliui'
import escalade from 'escalade/sync'
import { inspect } from 'util'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url';
import Parser from 'yargs-parser'
import { basename, dirname, extname, relative, resolve } from 'path'
import { getProcessArgvBin } from '../../build/lib/utils/process-argv.js'
import { YError } from '../../build/lib/yerror.js'
import y18n from 'y18n'

const __dirname = fileURLToPath(import.meta.url);
const mainFilename = __dirname.substring(0, __dirname.lastIndexOf('node_modules'));

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
  getProcessArgvBin,
  mainFilename: mainFilename || process.cwd(),
  Parser,
  path: {
    basename,
    dirname,
    extname,
    relative,
    resolve
  },
  process: {
    argv: () => process.argv,
    cwd: process.cwd,
    emitWarning: (warning, type) => process.emitWarning(warning, type),
    execPath: () => process.execPath,
    exit: (code) => {
      // eslint-disable-next-line n/no-process-exit
      process.exit(code);
    },
    nextTick: process.nextTick,
    stdColumns: typeof process.stdout.columns !== 'undefined' ? process.stdout.columns : null
  },
  readFileSync,
  stringWidth: (str) => {
    return [...str].length
  },
  y18n: y18n({
    directory: resolve(__dirname, '../../../locales'),
    updateFiles: false
  })
}
