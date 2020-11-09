// Bootstrap yargs for Deno platform:
import denoPlatformShim from './lib/platform-shims/deno.ts';
import {YargsWithShim} from './build/lib/yargs-factory.js';

const WrappedYargs = YargsWithShim(denoPlatformShim);

function Yargs(args?: string[]) {
  return WrappedYargs(args);
}

export default Yargs;
