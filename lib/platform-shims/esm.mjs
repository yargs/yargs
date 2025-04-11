'use strict'

import { notStrictEqual, strictEqual } from 'assert'
import cliui from 'cliui'
import escalade from 'escalade/sync'
import { inspect } from 'util'
import { fileURLToPath } from 'url';
import Parser from 'yargs-parser'
import { basename, dirname, extname, relative, resolve, join } from 'path'
import { getProcessArgvBin } from '../../build/lib/utils/process-argv.js'
import stringWidth from 'string-width';
import y18n from 'y18n'
import { createRequire } from 'node:module';
import getCallerFile from 'get-caller-file';
import { readFileSync, readdirSync } from 'node:fs'

const __dirname = fileURLToPath(import.meta.url);
const mainFilename = __dirname.substring(0, __dirname.lastIndexOf('node_modules'));
const require = createRequire(import.meta.url);

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
    resolve,
    join
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
  readdirSync,
  require,
  getCallerFile: () => {
    const callerFile = getCallerFile(3);
    return callerFile.match(/^file:\/\//) ? fileURLToPath(callerFile) : callerFile;
  },
  stringWidth,
  y18n: y18n({
    directory: resolve(__dirname, '../../../locales'),
    updateFiles: false
  })
}
