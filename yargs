// TODO: consolidate on using a helpers file at some point in the future, which
// is the approach currently used to export Parser and  applyExtends for ESM:
const {applyExtends, cjsPlatformShim, Parser, Yargs} = require('./build/index.cjs')
Yargs.applyExtends = (config, cwd, mergeExtends) => {
  return applyExtends(config, cwd, mergeExtends, cjsPlatformShim)
}
Yargs.Parser = Parser
module.exports = Yargs
