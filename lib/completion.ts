import {CommandInstance, isCommandBuilderCallback} from './command.js';
import {PlatformShim, assertNotStrictEqual} from './typings/common-types.js';
import * as templates from './completion-templates.js';
import {isPromise} from './utils/is-promise.js';
import {parseCommand} from './parse-command.js';
import {UsageInstance} from './usage.js';
import {YargsInstance} from './yargs-factory.js';
import {Arguments, DetailedArguments} from './typings/yargs-parser-types.js';

// add bash completions to your
// yargs-powered applications.

type CompletionCallback = (
  err: Error | null,
  completions: string[] | undefined
) => void;

/** Instance of the completion module. */
export interface CompletionInstance {
  completionKey: string;
  generateCompletionScript($0: string, cmd: string): string;
  getCompletion(
    args: string[],
    done: (err: Error | null, completions: string[] | undefined) => void
  ): any;
  registerFunction(fn: CompletionFunction): void;
  setParsed(parsed: DetailedArguments): void;
}

export class Completion implements CompletionInstance {
  completionKey = 'get-yargs-completions';

  private aliases: DetailedArguments['aliases'] | null = null;
  private customCompletionFunction: CompletionFunction | null = null;
  private indexAfterLastReset = 0;
  private readonly zshShell: boolean;

  constructor(
    private readonly yargs: YargsInstance,
    private readonly usage: UsageInstance,
    private readonly command: CommandInstance,
    private readonly shim: PlatformShim
  ) {
    this.zshShell =
      (this.shim.getEnv('SHELL')?.includes('zsh') ||
        this.shim.getEnv('ZSH_NAME')?.includes('zsh')) ??
      false;
  }

  private defaultCompletion(
    args: string[],
    argv: Arguments,
    current: string,
    done: CompletionCallback
  ): Arguments | void {
    const handlers = this.command.getCommandHandlers();
    for (let i = 0, ii = args.length; i < ii; ++i) {
      if (handlers[args[i]] && handlers[args[i]].builder) {
        const builder = handlers[args[i]].builder;
        if (isCommandBuilderCallback(builder)) {
          this.indexAfterLastReset = i + 1;
          const y = this.yargs.getInternalMethods().reset();
          builder(y, true);
          return y.argv;
        }
      }
    }

    const completions: string[] = [];

    this.commandCompletions(completions, args, current);
    this.optionCompletions(completions, args, argv, current);
    this.choicesFromOptionsCompletions(completions, args, argv, current);
    this.choicesFromPositionalsCompletions(completions, args, argv, current);
    done(null, completions);
  }

  // Default completions for commands
  private commandCompletions(
    completions: string[],
    args: string[],
    current: string
  ) {
    const parentCommands = this.yargs
      .getInternalMethods()
      .getContext().commands;
    if (
      !current.match(/^-/) &&
      parentCommands[parentCommands.length - 1] !== current &&
      !this.previousArgHasChoices(args)
    ) {
      this.usage.getCommands().forEach(usageCommand => {
        const commandName = parseCommand(usageCommand[0]).cmd;
        if (args.indexOf(commandName) === -1) {
          if (!this.zshShell) {
            completions.push(commandName);
          } else {
            const desc = usageCommand[1] || '';
            completions.push(commandName.replace(/:/g, '\\:') + ':' + desc);
          }
        }
      });
    }
  }

  // Default completions for - and -- options
  private optionCompletions(
    completions: string[],
    args: string[],
    argv: Arguments,
    current: string
  ) {
    if (
      (current.match(/^-/) || (current === '' && completions.length === 0)) &&
      !this.previousArgHasChoices(args)
    ) {
      const options = this.yargs.getOptions();
      const positionalKeys =
        this.yargs.getGroups()[this.usage.getPositionalGroupName()] || [];

      Object.keys(options.key).forEach(key => {
        const negable =
          !!options.configuration['boolean-negation'] &&
          options.boolean.includes(key);
        const isPositionalKey = positionalKeys.includes(key);

        // If the key is not positional and its aliases aren't in 'args', add the key to 'completions'
        if (
          !isPositionalKey &&
          !options.hiddenOptions.includes(key) &&
          !this.argsContainKey(args, key, negable)
        ) {
          this.completeOptionKey(
            key,
            completions,
            current,
            negable && !!options.default[key]
          );
        }
      });
    }
  }

  private choicesFromOptionsCompletions(
    completions: string[],
    args: string[],
    argv: Arguments,
    current: string
  ) {
    if (this.previousArgHasChoices(args)) {
      const choices = this.getPreviousArgChoices(args);
      if (choices && choices.length > 0) {
        completions.push(...choices.map(c => c.replace(/:/g, '\\:')));
      }
    }
  }

  private choicesFromPositionalsCompletions(
    completions: string[],
    args: string[],
    argv: Arguments,
    current: string
  ) {
    if (
      current === '' &&
      completions.length > 0 &&
      this.previousArgHasChoices(args)
    ) {
      return;
    }

    const positionalKeys =
      this.yargs.getGroups()[this.usage.getPositionalGroupName()] || [];
    const offset = Math.max(
      this.indexAfterLastReset,
      this.yargs.getInternalMethods().getContext().commands.length +
        /* name of the script is first param */ 1
    );

    const positionalKey = positionalKeys[argv._.length - offset - 1];
    if (!positionalKey) {
      return;
    }

    const choices = this.yargs.getOptions().choices[positionalKey] || [];
    for (const choice of choices) {
      if (choice.startsWith(current)) {
        completions.push(choice.replace(/:/g, '\\:'));
      }
    }
  }

  private getPreviousArgChoices(args: string[]): string[] | void {
    if (args.length < 1) return; // no args
    let previousArg = args[args.length - 1];
    let filter = '';
    // use second to last argument if the last one is not an option starting with --
    if (!previousArg.startsWith('-') && args.length > 1) {
      filter = previousArg; // use last arg as filter for choices
      previousArg = args[args.length - 2];
    }
    if (!previousArg.startsWith('-')) return; // still no valid arg, abort
    const previousArgKey = previousArg.replace(/^-+/, '');

    const options = this.yargs.getOptions();

    const possibleAliases = [
      previousArgKey,
      ...(this.yargs.getAliases()[previousArgKey] || []),
    ];
    let choices: string[] | undefined;
    // Find choices across all possible aliases
    for (const possibleAlias of possibleAliases) {
      if (
        Object.prototype.hasOwnProperty.call(options.key, possibleAlias) &&
        Array.isArray(options.choices[possibleAlias])
      ) {
        choices = options.choices[possibleAlias];
        break;
      }
    }

    if (choices) {
      return choices.filter(choice => !filter || choice.startsWith(filter));
    }
  }

  private previousArgHasChoices(args: string[]): boolean {
    const choices = this.getPreviousArgChoices(args);
    return choices !== undefined && choices.length > 0;
  }

  private argsContainKey(
    args: string[],
    key: string,
    negable: boolean
  ): boolean {
    const argsContains = (s: string) =>
      args.indexOf((/^[^0-9]$/.test(s) ? '-' : '--') + s) !== -1;
    if (argsContains(key)) return true;
    if (negable && argsContains(`no-${key}`)) return true;
    if (this.aliases) {
      for (const alias of this.aliases[key]) {
        if (argsContains(alias)) return true;
      }
    }
    return false;
  }

  // Add completion for a single - or -- option
  private completeOptionKey(
    key: string,
    completions: string[],
    current: string,
    negable: boolean
  ) {
    let keyWithDesc = key;
    if (this.zshShell) {
      const descs = this.usage.getDescriptions();
      const aliasKey = this?.aliases?.[key]?.find(alias => {
        const desc = descs[alias];
        return typeof desc === 'string' && desc.length > 0;
      });
      const descFromAlias = aliasKey ? descs[aliasKey] : undefined;
      const desc = descs[key] ?? descFromAlias ?? '';
      keyWithDesc = `${key.replace(/:/g, '\\:')}:${desc
        .replace('__yargsString__:', '')
        .replace(/(\r\n|\n|\r)/gm, ' ')}`;
    }

    const startsByTwoDashes = (s: string) => /^--/.test(s);
    const isShortOption = (s: string) => /^[^0-9]$/.test(s);
    const dashes =
      !startsByTwoDashes(current) && isShortOption(key) ? '-' : '--';

    completions.push(dashes + keyWithDesc);
    if (negable) {
      completions.push(dashes + 'no-' + keyWithDesc);
    }
  }

  // a custom completion function can be provided
  // to completion().
  private customCompletion(
    args: string[],
    argv: Arguments,
    current: string,
    done: CompletionCallback
  ) {
    assertNotStrictEqual(this.customCompletionFunction, null, this.shim);

    if (isSyncCompletionFunction(this.customCompletionFunction)) {
      const result = this.customCompletionFunction(current, argv);

      // promise based completion function.
      if (isPromise(result)) {
        return result
          .then(list => {
            this.shim.process.nextTick(() => {
              done(null, list);
            });
          })
          .catch(err => {
            this.shim.process.nextTick(() => {
              done(err, undefined);
            });
          });
      }
      // synchronous completion function.
      return done(null, result);
    } else if (isFallbackCompletionFunction(this.customCompletionFunction)) {
      return (this.customCompletionFunction as FallbackCompletionFunction)(
        current,
        argv,
        (onCompleted = done) =>
          this.defaultCompletion(args, argv, current, onCompleted),
        completions => {
          done(null, completions);
        }
      );
    } else {
      return (this.customCompletionFunction as AsyncCompletionFunction)(
        current,
        argv,
        completions => {
          done(null, completions);
        }
      );
    }
  }

  // get a list of completion commands.
  // 'args' is the array of strings from the line to be completed
  getCompletion(args: string[], done: CompletionCallback): any {
    const current = args.length ? args[args.length - 1] : '';
    const argv = this.yargs.parse(args, true);

    const completionFunction = this.customCompletionFunction
      ? (argv: Arguments) => this.customCompletion(args, argv, current, done)
      : (argv: Arguments) => this.defaultCompletion(args, argv, current, done);

    return isPromise(argv)
      ? argv.then(completionFunction)
      : completionFunction(argv);
  }

  // generate the completion script to add to your .bashrc.
  generateCompletionScript($0: string, cmd: string): string {
    let script = this.zshShell
      ? templates.completionZshTemplate
      : templates.completionShTemplate;
    const name = this.shim.path.basename($0);

    // add ./ to applications not yet installed as bin.
    if ($0.match(/\.js$/)) $0 = `./${$0}`;

    script = script.replace(/{{app_name}}/g, name);
    script = script.replace(/{{completion_command}}/g, cmd);
    return script.replace(/{{app_path}}/g, $0);
  }

  // register a function to perform your own custom
  // completions. this function can be either
  // synchronous or asynchronous.
  registerFunction(fn: CompletionFunction) {
    this.customCompletionFunction = fn;
  }

  setParsed(parsed: DetailedArguments) {
    this.aliases = parsed.aliases;
  }
}

// For backwards compatibility
export function completion(
  yargs: YargsInstance,
  usage: UsageInstance,
  command: CommandInstance,
  shim: PlatformShim
): CompletionInstance {
  return new Completion(yargs, usage, command, shim);
}

export type CompletionFunction =
  | SyncCompletionFunction
  | AsyncCompletionFunction
  | FallbackCompletionFunction;

interface SyncCompletionFunction {
  (current: string, argv: Arguments): string[] | Promise<string[]>;
}

interface AsyncCompletionFunction {
  (current: string, argv: Arguments, done: (completions: string[]) => any): any;
}

interface FallbackCompletionFunction {
  (
    current: string,
    argv: Arguments,
    completionFilter: (onCompleted?: CompletionCallback) => any,
    done: (completions: string[]) => any
  ): any;
}

function isSyncCompletionFunction(
  completionFunction: CompletionFunction
): completionFunction is SyncCompletionFunction {
  return completionFunction.length < 3;
}

function isFallbackCompletionFunction(
  completionFunction: CompletionFunction
): completionFunction is FallbackCompletionFunction {
  return completionFunction.length > 3;
}
