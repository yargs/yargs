'use strict'

// Bootstraps yargs for ESM:
import esmPlatformShim from './lib/platform-shims/esm.mjs'
import { getProcessArgvWithoutBin } from './build/lib/utils/process-argv.js'
import { YargsWithShim } from './build/lib/yargs-factory.js'

const Yargs = YargsWithShim(esmPlatformShim)

export {
  getProcessArgvWithoutBin,
  Yargs,
}
