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
          const y = this.yargs.getInternalMethods().reset();
          builder(y, true);
          return y.argv;
        }
      }
    }

    const completions: string[] = [];

    this.commandCompletions(completions, args, current);
    this.optionCompletions(completions, args, argv, current);
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
      parentCommands[parentCommands.length - 1] !== current
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
    if (current.match(/^-/) || (current === '' && completions.length === 0)) {
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
          !this.argsContainKey(args, argv, key, negable)
        ) {
          this.completeOptionKey(key, completions, current);
          if (negable && !!options.default[key])
            this.completeOptionKey(`no-${key}`, completions, current);
        }
      });
    }
  }

  private argsContainKey(
    args: string[],
    argv: Arguments,
    key: string,
    negable: boolean
  ): boolean {
    if (args.indexOf(`--${key}`) !== -1) return true;
    if (negable && args.indexOf(`--no-${key}`) !== -1) return true;
    if (this.aliases) {
      // search for aliases in parsed argv
      // can't do the same thing for main option names because argv can contain default values
      for (const alias of this.aliases[key]) {
        if (argv[alias] !== undefined) return true;
      }
    }
    return false;
  }

  // Add completion for a single - or -- option
  private completeOptionKey(
    key: string,
    completions: string[],
    current: string
  ) {
    const descs = this.usage.getDescriptions();
    const startsByTwoDashes = (s: string) => /^--/.test(s);
    const isShortOption = (s: string) => /^[^0-9]$/.test(s);
    const dashes =
      !startsByTwoDashes(current) && isShortOption(key) ? '-' : '--';
    if (!this.zshShell) {
      completions.push(dashes + key);
    } else {
      const desc = descs[key] || '';
      completions.push(
        dashes +
          `${key.replace(/:/g, '\\:')}:${desc.replace('__yargsString__:', '')}`
      );
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
