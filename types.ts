// expose types for the benefit of Deno.
import type {
  YargsInstance as YargsType,
  Arguments,
} from './build/lib/yargs-factory.d.ts';
  
import type { CommandHandlerDefinition } from './build/lib/command.js';

export type {Arguments, YargsType, CommandHandlerDefinition};
