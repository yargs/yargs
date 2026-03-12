import {Arguments, Parser} from '../typings/yargs-parser-types.js';
import type {Configuration} from '../yargs-factory.js';

interface OptionPresenceOptions {
  argv: Arguments;
  key: string;
  aliases?: string[];
  configuration: Configuration;
  parser: Pick<Parser, 'camelCase' | 'decamelize'>;
}

export function optionIsPresent({
  argv,
  key,
  aliases = [],
  configuration,
  parser,
}: OptionPresenceOptions): boolean {
  const candidates = new Set<string>();

  for (const optionKey of [key, ...aliases]) {
    candidates.add(optionKey);

    if (configuration['camel-case-expansion']) {
      candidates.add(parser.camelCase(optionKey));
    }

    candidates.add(parser.decamelize(optionKey, '-'));
  }

  for (const candidate of candidates) {
    if (candidate && argv[candidate] !== undefined) {
      return true;
    }
  }

  return false;
}
