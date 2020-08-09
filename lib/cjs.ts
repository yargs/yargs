'use strict'
// This file is used to bootstrap yargs for its legacy CommonJS interface:

import { argsert } from './argsert.js'
import { isPromise } from './utils/is-promise.js'
import { objFilter } from './utils/obj-filter.js'
import { globalMiddlewareFactory } from './middleware.js'
import { parseCommand } from './parse-command.js'
import * as processArgv from './utils/process-argv.js'
import { YargsFactory, rebase } from './yargs-factory.js'
import { YError } from './yerror.js'

// See https://github.com/yargs/yargs#supported-nodejs-versions for our
// version support policy. The YARGS_MIN_NODE_VERSION is used for testing only.
const minNodeVersion = (process && process.env && process.env.YARGS_MIN_NODE_VERSION)
  ? Number(process.env.YARGS_MIN_NODE_VERSION) : 10
if (process && process.version) {
  const major = Number(process.version.match(/v([^.]+)/)![1])
  if (major < minNodeVersion) {
    throw Error(`yargs supports a minimum Node.js version of ${minNodeVersion}. Read our version support policy: https://github.com/yargs/yargs#supported-nodejs-versions`)
  }
}

// Inject CommonJS dependencies:
const Parser = require('yargs-parser')
const { resolve } = require('path')
const y18n = require('y18n')
const Yargs = YargsFactory({
  findUp: require('escalade/sync'),
  mainFilename: require?.main?.filename || process.cwd(),
  Parser,
  require: (require as any),
  requireDirectory: require('require-directory'),
  stringWidth: require('string-width'),
  y18n: y18n({
    directory: resolve(__dirname, '../locales'),
    updateFiles: false
  })
})

export default Object.assign(Yargs, {
  argsert,
  globalMiddlewareFactory,
  isPromise,
  objFilter,
  parseCommand,
  Parser,
  processArgv,
  rebase,
  YError
})
