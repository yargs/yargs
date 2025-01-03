import {notStrictEqual, strictEqual} from 'assert';
import * as processArgv from '../utils/process-argv.js';

const {readFileSync} = require('fs');
const {inspect} = require('util');
const {resolve} = require('path');
const y18n = require('y18n');
const Parser = require('yargs-parser');

export default {
  assert: {
    notStrictEqual,
    strictEqual,
  },
  cliui: require('cliui'),
  findUp: require('escalade/sync'),
  getEnv: (key: string) => {
    return process.env[key];
  },
  getCallerFile: require('get-caller-file'),
  getProcessArgvBin: processArgv.getProcessArgvBin,
  inspect,
  mainFilename: require?.main?.filename ?? process.cwd(),
  Parser,
  path: require('path'),
  process: {
    argv: () => process.argv,
    cwd: process.cwd,
    emitWarning: (warning: string | Error, type?: string) =>
      process.emitWarning(warning, type),
    execPath: () => process.execPath,
    exit: (code: number) => {
      // eslint-disable-next-line n/no-process-exit
      process.exit(code);
    },
    nextTick: process.nextTick,
    stdColumns:
      typeof process.stdout.columns !== 'undefined'
        ? process.stdout.columns
        : null,
  },
  readFileSync,
  require: require as any,
  requireDirectory: require('require-directory'),
  stringWidth: require('string-width'),
  y18n: y18n({
    directory: resolve(__dirname, '../locales'),
    updateFiles: false,
  }),
};
