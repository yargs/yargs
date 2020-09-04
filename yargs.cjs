// CJS import shim for older versions of Node.js.
// this can be removed once all supported Node.js versions support
// export maps:
const {applyExtends, cjsPlatformShim, Parser, rebase, Yargs} = require('./build/index.cjs')
Yargs.applyExtends = (config, cwd, mergeExtends) => {
  return applyExtends(config, cwd, mergeExtends, cjsPlatformShim)
}
Yargs.Parser = Parser
Yargs.rebase = rebase
module.exports = Yargs
