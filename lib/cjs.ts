'use strict';
// Bootstraps yargs for a CommonJS runtime:

import {applyExtends} from './utils/apply-extends';
import {argsert} from './argsert.js';
import {isPromise} from './utils/is-promise.js';
import {objFilter} from './utils/obj-filter.js';
import {parseCommand} from './parse-command.js';
import * as processArgv from './utils/process-argv.js';
import {YargsFactory} from './yargs-factory.js';
import {YError} from './yerror.js';
import cjsPlatformShim from './platform-shims/cjs.js';

// See https://github.com/yargs/yargs#supported-nodejs-versions for our
// version support policy. The YARGS_MIN_NODE_VERSION is used for testing only.
const minNodeVersion = process?.env?.YARGS_MIN_NODE_VERSION
  ? Number(process.env.YARGS_MIN_NODE_VERSION)
  : 12;
if (process && process.version) {
  const major = Number(process.version.match(/v([^.]+)/)![1]);
  if (major < minNodeVersion) {
    throw Error(
      `yargs supports a minimum Node.js version of ${minNodeVersion}. Read our version support policy: https://github.com/yargs/yargs#supported-nodejs-versions`
    );
  }
}

const Parser = require('yargs-parser');
const Yargs = YargsFactory(cjsPlatformShim);

export default {
  applyExtends,
  cjsPlatformShim,
  Yargs,
  argsert,
  isPromise,
  objFilter,
  parseCommand,
  Parser,
  processArgv,
  YError,
};
