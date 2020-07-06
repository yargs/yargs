'use strict'

// See https://github.com/yargs/yargs#supported-nodejs-versions for our
// version support policy. The YARGS_MIN_NODE_VERSION is used for testing only.
const minNodeVersion = (process && process.env && process.env.YARGS_MIN_NODE_VERSION)
  ? Number(process.env.YARGS_MIN_NODE_VERSION) : 10
if (process && process.version) {
  const major = Number(process.version.match(/v([^.]+)/)[1])
  if (major < minNodeVersion) {
    throw Error(`yargs supports a minimum Node.js version of ${minNodeVersion}. Read our version support policy: https://github.com/yargs/yargs#supported-nodejs-versions`)
  }
}

const { Yargs, rebase } = require('./build/lib/yargs')
const Parser = require('yargs-parser')

exports = module.exports = Yargs
exports.rebase = rebase

// allow consumers to directly use the version of yargs-parser used by yargs
exports.Parser = Parser
