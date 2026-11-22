// Bootstrap yargs for Deno platform:
import denoPlatformShim from './lib/platform-shims/deno.ts';
import {YargsFactory} from './build/lib/yargs-factory.js';

export type {Arguments} from './deno-types.ts';
export type {YargsInstance} from './build/lib/yargs-factory.js';

const Yargs = YargsFactory(denoPlatformShim);

export default Yargs;
