'use strict'

// Bootstraps yargs in ESM mode:
import escalade from 'escalade/sync'
import { fileURLToPath } from 'url';
import Parser from 'yargs-parser'
import { dirname, resolve } from 'path'
import { YargsFactory } from './build/lib/yargs-factory.js'

// TODO: stop using createRequire as soon as we've ported: cliui, y18n, etc.
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const __dirname = dirname(fileURLToPath(import.meta.url));

const Yargs = YargsFactory({
  findUp: escalade,
  Parser,
  require,
  requireDirectory: require('require-directory'),
  stringWidth: require('string-width'),
  y18n: require('y18n')({
    directory: resolve(__dirname, '../locales'),
    updateFiles: false
  })
})

export default Yargs
