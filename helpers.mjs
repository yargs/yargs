import { applyExtends as _applyExtends } from './build/lib/utils/apply-extends.js'
import { hideBin } from './build/lib/utils/process-argv.js'
import Parser from 'yargs-parser'
import shim from './lib/platform-shims/esm.mjs'

const applyExtends = (config, cwd, mergeExtends) => {
  return _applyExtends(config, cwd, mergeExtends, shim)
}

const rebase = (base, dir) => {
  return shim.path.relative(base, dir)
}

export {
  applyExtends,
  hideBin,
  Parser,
  rebase
}
