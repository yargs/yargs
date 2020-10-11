// expose types for the benefit of Deno.
import type {
  YargsInstance as YargsType,
  Arguments,
} from './build/lib/yargs-factory.d.ts';

export type {Arguments, YargsType};
