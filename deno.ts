// Bootstrap yargs for Deno platform:
import denoPlatformShim from './lib/platform-shims/deno.ts';
import {YargsFactory} from './build/lib/yargs-factory.js';

const WrappedYargs = YargsFactory(denoPlatformShim);

function Yargs(args?: string[]) {
  return WrappedYargs(args);
}

export default Yargs;
