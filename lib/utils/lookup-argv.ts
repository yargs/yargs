import {Dictionary} from '../typings/common-types.js';

// Look up a parsed option by its declared name or any alias.
// yargs-parser already expands camelCase into aliases and then
// drops keys according to parserConfiguration; we just check
// which of those names remain in argv.
export function lookupArgv(
  argv: Dictionary,
  key: string,
  aliases: Dictionary<string[]> = {}
): unknown {
  const names = [key].concat(aliases[key] || []);
  const found = names.find(name =>
    Object.prototype.hasOwnProperty.call(argv, name)
  );
  return found !== undefined ? argv[found] : undefined;
}
