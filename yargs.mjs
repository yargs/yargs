// TODO: consolidate on using a helpers file at some point in the future, which
// is the approach currently used to export Parser and applyExtends for ESM:
import {
  applyExtends,
  cjsPlatformShim,
  Parser,
  processArgv,
  Yargs,
} from './build/index.cjs';
Yargs.applyExtends = (config, cwd, mergeExtends) => {
  return applyExtends(config, cwd, mergeExtends, cjsPlatformShim);
};
Yargs.hideBin = processArgv.hideBin;
Yargs.Parser = Parser;
export default Yargs;
