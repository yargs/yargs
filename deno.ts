// Bootstrap yargs for Deno platform:
import denoPlatformShim from './lib/platform-shims/deno.ts'
import { YargsWithShim } from './build/lib/yargs-factory.js'
import type { YargsInstance as YargsType } from './build/lib/yargs-factory.d.ts'

const WrappedYargs = YargsWithShim(denoPlatformShim)

function Yargs (args?: string[]): YargsType {
  return WrappedYargs(args)
}

export default Yargs
