'use strict'

// Bootstraps yargs in ESM mode:
import escalade from 'escalade/sync'
import { inspect } from 'util'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url';
import Parser from 'yargs-parser'
import { basename, dirname, extname, relative, resolve } from 'path'
import { YargsFactory } from './build/lib/yargs-factory.js'
import { getProcessArgvBin } from './build/lib/utils/process-argv.js'

// TODO: stop using createRequire as soon as we've ported: cliui, y18n, etc.
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const __dirname = dirname(fileURLToPath(import.meta.url));

const Yargs = YargsFactory({
  cliui: require('cliui'),
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
  y18n: require('y18n')({
    directory: resolve(__dirname, '../locales'),
    updateFiles: false
  })
})

export default Yargs
