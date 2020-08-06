'use strict'

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

import { YargsFactory, rebase } from './lib/yargs-factory'
import * as processArgv from './lib/utils/process-argv'

const Parser = require('yargs-parser')
const Yargs = YargsFactory({
  findUp: require('find-up'),
  Parser,
  require: (require as any),
  requireDirectory: require('require-directory'),
  stringWidth: require('string-width'),
  y18nFactory: require('y18n')
})

// Match the current CommonJS Interface exposed by yargs:
interface CJSInterface {
  (): void;
  rebase: Function;
  Parser: Function;
  processArgv: object;
}
const cjsExport = (Yargs as any) as CJSInterface;
cjsExport.rebase = rebase
cjsExport.Parser = Parser
cjsExport.processArgv = processArgv
export default cjsExport;
