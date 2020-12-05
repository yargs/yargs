import {
  Dictionary,
  assertNotStrictEqual,
  RequireDirectoryOptions,
  PlatformShim,
} from './typings/common-types.js';
import {isPromise} from './utils/is-promise.js';
import {
  applyMiddleware,
  commandMiddlewareFactory,
  Middleware,
} from './middleware.js';
import {parseCommand, Positional} from './parse-command.js';
import {UsageInstance} from './usage.js';
import {ValidationInstance} from './validation.js';
import {
  YargsInstance,
  isYargsInstance,
  Options,
  OptionDefinition,
  Context,
  Configuration,
  Arguments,
  DetailedArguments,
} from './yargs-factory.js';
import whichModule from './utils/which-module.js';

const DEFAULT_MARKER = /(^\*)|(^\$0)/;
export type DefinitionOrCommandName = string | CommandHandlerDefinition;

// handles parsing positional arguments,
// and populating argv with said positional
// arguments.
export function command(
  yargs: YargsInstance,
  usage: UsageInstance,
  validation: ValidationInstance,
  globalMiddleware: Middleware[] = [],
  shim: PlatformShim
) {
  const self: CommandInstance = {} as CommandInstance;
  let handlers: Dictionary<CommandHandler> = {};
  let aliasMap: Dictionary<string> = {};
  let defaultCommand: CommandHandler | undefined;

  self.addHandler = function addHandler(
    cmd: DefinitionOrCommandName | [DefinitionOrCommandName, ...string[]],
    description?: string | false,
    builder?: CommandBuilder,
    handler?: CommandHandlerCallback,
    commandMiddleware?: Middleware[],
    deprecated?: boolean
  ) {
    let aliases: string[] = [];
    const middlewares = commandMiddlewareFactory(commandMiddleware);
    handler = handler || (() => {});

    // If an array is provided that is all CommandHandlerDefinitions, add
    // each handler individually:
    if (Array.isArray(cmd)) {
      if (isCommandAndAliases(cmd)) {
        [cmd, ...aliases] = cmd;
      } else {
        for (const command of cmd) {
          self.addHandler(command);
        }
      }
    } else if (isCommandHandlerDefinition(cmd)) {
      let command =
        Array.isArray(cmd.command) || typeof cmd.command === 'string'
          ? cmd.command
          : moduleName(cmd);
      if (cmd.aliases)
        command = ([] as string[]).concat(command).concat(cmd.aliases);
      self.addHandler(
        command,
        extractDesc(cmd),
        cmd.builder,
        cmd.handler,
        cmd.middlewares,
        cmd.deprecated
      );
      return;
    } else if (isCommandBuilderDefinition(builder)) {
      // Allow a module to be provided as builder, rather than function:
      self.addHandler(
        [cmd].concat(aliases),
        description,
        builder.builder,
        builder.handler,
        builder.middlewares,
        builder.deprecated
      );
      return;
    }

    // The 'cmd' provided was a string, we apply the command DSL:
    // https://github.com/yargs/yargs/blob/master/docs/advanced.md#advanced-topics
    if (typeof cmd === 'string') {
      // parse positionals out of cmd string
      const parsedCommand = parseCommand(cmd);

      // remove positional args from aliases only
      aliases = aliases.map(alias => parseCommand(alias).cmd);

      // check for default and filter out '*'
      let isDefault = false;
      const parsedAliases = [parsedCommand.cmd].concat(aliases).filter(c => {
        if (DEFAULT_MARKER.test(c)) {
          isDefault = true;
          return false;
        }
        return true;
      });

      // standardize on $0 for default command.
      if (parsedAliases.length === 0 && isDefault) parsedAliases.push('$0');

      // shift cmd and aliases after filtering out '*'
      if (isDefault) {
        parsedCommand.cmd = parsedAliases[0];
        aliases = parsedAliases.slice(1);
        cmd = cmd.replace(DEFAULT_MARKER, parsedCommand.cmd);
      }

      // populate aliasMap
      aliases.forEach(alias => {
        aliasMap[alias] = parsedCommand.cmd;
      });

      if (description !== false) {
        usage.command(cmd, description, isDefault, aliases, deprecated);
      }

      handlers[parsedCommand.cmd] = {
        original: cmd,
        description,
        handler,
        builder: builder || {},
        middlewares,
        deprecated,
        demanded: parsedCommand.demanded,
        optional: parsedCommand.optional,
      };

      if (isDefault) defaultCommand = handlers[parsedCommand.cmd];
    }
  };

  self.addDirectory = function addDirectory(
    dir,
    context,
    req,
    callerFile,
    opts
  ) {
    opts = opts || {};
    // disable recursion to support nested directories of subcommands
    if (typeof opts.recurse !== 'boolean') opts.recurse = false;
    // exclude 'json', 'coffee' from require-directory defaults
    if (!Array.isArray(opts.extensions)) opts.extensions = ['js'];
    // allow consumer to define their own visitor function
    const parentVisit =
      typeof opts.visit === 'function' ? opts.visit : (o: any) => o;
    // call addHandler via visitor function
    opts.visit = function visit(obj, joined, filename) {
      const visited = parentVisit(obj, joined, filename);
      // allow consumer to skip modules with their own visitor
      if (visited) {
        // check for cyclic reference
        // each command file path should only be seen once per execution
        if (~context.files.indexOf(joined)) return visited;
        // keep track of visited files in context.files
        context.files.push(joined);
        self.addHandler(visited);
      }
      return visited;
    };
    shim.requireDirectory({require: req, filename: callerFile}, dir, opts);
  };

  // lookup module object from require()d command and derive name
  // if module was not require()d and no name given, throw error
  function moduleName(obj: CommandHandlerDefinition) {
    const mod = whichModule(obj);
    if (!mod)
      throw new Error(`No command name given for module: ${shim.inspect(obj)}`);
    return commandFromFilename(mod.filename);
  }

  // derive command name from filename
  function commandFromFilename(filename: string) {
    return shim.path.basename(filename, shim.path.extname(filename));
  }

  function extractDesc({
    describe,
    description,
    desc,
  }: CommandHandlerDefinition) {
    for (const test of [describe, description, desc]) {
      if (typeof test === 'string' || test === false) return test;
      assertNotStrictEqual(test, true as const, shim);
    }
    return false;
  }

  self.getCommands = () => Object.keys(handlers).concat(Object.keys(aliasMap));

  self.getCommandHandlers = () => handlers;

  self.hasDefaultCommand = () => !!defaultCommand;

  self.runCommand = function runCommand(command, yargs, parsed, commandIndex) {
    let aliases = parsed.aliases;
    const commandHandler =
      handlers[command!] || handlers[aliasMap[command!]] || defaultCommand;
    const currentContext = yargs.getContext();
    let numFiles = currentContext.files.length;
    const parentCommands = currentContext.commands.slice();

    // what does yargs look like after the builder is run?
    let innerArgv: Arguments | Promise<Arguments> = parsed.argv;
    let positionalMap: Dictionary<string[]> = {};
    if (command) {
      currentContext.commands.push(command);
      currentContext.fullCommands.push(commandHandler.original);
    }
    const builder = commandHandler.builder;
    if (isCommandBuilderCallback(builder)) {
      // a function can be provided, which builds
      // up a yargs chain and possibly returns it.
      const builderOutput = builder(yargs.reset(parsed.aliases));
      const innerYargs = isYargsInstance(builderOutput) ? builderOutput : yargs;
      if (shouldUpdateUsage(innerYargs)) {
        innerYargs
          .getUsageInstance()
          .usage(
            usageFromParentCommandsCommandHandler(
              parentCommands,
              commandHandler
            ),
            commandHandler.description
          );
      }
      innerArgv = innerYargs._parseArgs(null, null, true, commandIndex);
      aliases = (innerYargs.parsed as DetailedArguments).aliases;
    } else if (isCommandBuilderOptionDefinitions(builder)) {
      // as a short hand, an object can instead be provided, specifying
      // the options that a command takes.
      const innerYargs = yargs.reset(parsed.aliases);
      if (shouldUpdateUsage(innerYargs)) {
        innerYargs
          .getUsageInstance()
          .usage(
            usageFromParentCommandsCommandHandler(
              parentCommands,
              commandHandler
            ),
            commandHandler.description
          );
      }
      Object.keys(commandHandler.builder).forEach(key => {
        innerYargs.option(key, builder[key]);
      });
      innerArgv = innerYargs._parseArgs(null, null, true, commandIndex);
      aliases = (innerYargs.parsed as DetailedArguments).aliases;
    }

    if (!yargs._hasOutput()) {
      positionalMap = populatePositionals(
        commandHandler,
        innerArgv as Arguments,
        currentContext
      );
    }

    const middlewares = globalMiddleware
      .slice(0)
      .concat(commandHandler.middlewares);
    applyMiddleware(innerArgv, yargs, middlewares, true);

    // we apply validation post-hoc, so that custom
    // checks get passed populated positional arguments.
    if (!yargs._hasOutput()) {
      yargs._runValidation(
        innerArgv as Arguments,
        aliases,
        positionalMap,
        (yargs.parsed as DetailedArguments).error,
        !command
      );
    }

    if (commandHandler.handler && !yargs._hasOutput()) {
      yargs._setHasOutput();
      // to simplify the parsing of positionals in commands,
      // we temporarily populate '--' rather than _, with arguments
      const populateDoubleDash = !!yargs.getOptions().configuration[
        'populate--'
      ];
      yargs._postProcess(innerArgv, populateDoubleDash);

      innerArgv = applyMiddleware(innerArgv, yargs, middlewares, false);
      let handlerResult;
      if (isPromise(innerArgv)) {
        handlerResult = innerArgv.then(argv => commandHandler.handler(argv));
      } else {
        handlerResult = commandHandler.handler(innerArgv);
      }

      const handlerFinishCommand = yargs.getHandlerFinishCommand();
      if (isPromise(handlerResult)) {
        yargs.getUsageInstance().cacheHelpMessage();
        handlerResult
          .then(value => {
            if (handlerFinishCommand) {
              handlerFinishCommand(value);
            }
          })
          .catch(error => {
            try {
              yargs.getUsageInstance().fail(null, error);
            } catch (err) {
              // fail's throwing would cause an unhandled rejection.
            }
          })
          .then(() => {
            yargs.getUsageInstance().clearCachedHelpMessage();
          });
      } else {
        if (handlerFinishCommand) {
          handlerFinishCommand(handlerResult);
        }
      }
    }

    if (command) {
      currentContext.commands.pop();
      currentContext.fullCommands.pop();
    }
    numFiles = currentContext.files.length - numFiles;
    if (numFiles > 0) currentContext.files.splice(numFiles * -1, numFiles);

    return innerArgv;
  };

  function shouldUpdateUsage(yargs: YargsInstance) {
    return (
      !yargs.getUsageInstance().getUsageDisabled() &&
      yargs.getUsageInstance().getUsage().length === 0
    );
  }

  function usageFromParentCommandsCommandHandler(
    parentCommands: string[],
    commandHandler: CommandHandler
  ) {
    const c = DEFAULT_MARKER.test(commandHandler.original)
      ? commandHandler.original.replace(DEFAULT_MARKER, '').trim()
      : commandHandler.original;
    const pc = parentCommands.filter(c => {
      return !DEFAULT_MARKER.test(c);
    });
    pc.push(c);
    return `$0 ${pc.join(' ')}`;
  }

  self.runDefaultBuilderOn = function (yargs) {
    assertNotStrictEqual(defaultCommand, undefined, shim);
    if (shouldUpdateUsage(yargs)) {
      // build the root-level command string from the default string.
      const commandString = DEFAULT_MARKER.test(defaultCommand.original)
        ? defaultCommand.original
        : defaultCommand.original.replace(/^[^[\]<>]*/, '$0 ');
      yargs.getUsageInstance().usage(commandString, defaultCommand.description);
    }
    const builder = defaultCommand.builder;
    if (isCommandBuilderCallback(builder)) {
      builder(yargs);
    } else if (!isCommandBuilderDefinition(builder)) {
      Object.keys(builder).forEach(key => {
        yargs.option(key, builder[key]);
      });
    }
  };

  // transcribe all positional arguments "command <foo> <bar> [apple]"
  // onto argv.
  function populatePositionals(
    commandHandler: CommandHandler,
    argv: Arguments,
    context: Context
  ) {
    argv._ = argv._.slice(context.commands.length); // nuke the current commands
    const demanded = commandHandler.demanded.slice(0);
    const optional = commandHandler.optional.slice(0);
    const positionalMap: Dictionary<string[]> = {};

    validation.positionalCount(demanded.length, argv._.length);

    while (demanded.length) {
      const demand = demanded.shift()!;
      populatePositional(demand, argv, positionalMap);
    }

    while (optional.length) {
      const maybe = optional.shift()!;
      populatePositional(maybe, argv, positionalMap);
    }

    argv._ = context.commands.concat(argv._.map(a => '' + a));

    postProcessPositionals(
      argv,
      positionalMap,
      self.cmdToParseOptions(commandHandler.original)
    );

    return positionalMap;
  }

  function populatePositional(
    positional: Positional,
    argv: Arguments,
    positionalMap: Dictionary<string[]>
  ) {
    const cmd = positional.cmd[0];
    if (positional.variadic) {
      positionalMap[cmd] = argv._.splice(0).map(String);
    } else {
      if (argv._.length) positionalMap[cmd] = [String(argv._.shift())];
    }
  }

  // we run yargs-parser against the positional arguments
  // applying the same parsing logic used for flags.
  function postProcessPositionals(
    argv: Arguments,
    positionalMap: Dictionary<string[]>,
    parseOptions: Positionals
  ) {
    // combine the parsing hints we've inferred from the command
    // string with explicitly configured parsing hints.
    const options = Object.assign({}, yargs.getOptions());
    options.default = Object.assign(parseOptions.default, options.default);
    for (const key of Object.keys(parseOptions.alias)) {
      options.alias[key] = (options.alias[key] || []).concat(
        parseOptions.alias[key]
      );
    }
    options.array = options.array.concat(parseOptions.array);
    options.config = {}; //  don't load config when processing positionals.

    const unparsed: string[] = [];
    Object.keys(positionalMap).forEach(key => {
      positionalMap[key].map(value => {
        if (options.configuration['unknown-options-as-args'])
          options.key[key] = true;
        unparsed.push(`--${key}`);
        unparsed.push(value);
      });
    });

    // short-circuit parse.
    if (!unparsed.length) return;

    const config: Configuration = Object.assign({}, options.configuration, {
      'populate--': true,
    });
    const parsed = shim.Parser.detailed(
      unparsed,
      Object.assign({}, options, {
        configuration: config,
      })
    );

    if (parsed.error) {
      yargs.getUsageInstance().fail(parsed.error.message, parsed.error);
    } else {
      // only copy over positional keys (don't overwrite
      // flag arguments that were already parsed).
      const positionalKeys = Object.keys(positionalMap);
      Object.keys(positionalMap).forEach(key => {
        positionalKeys.push(...parsed.aliases[key]);
      });

      Object.keys(parsed.argv).forEach(key => {
        if (positionalKeys.indexOf(key) !== -1) {
          // any new aliases need to be placed in positionalMap, which
          // is used for validation.
          if (!positionalMap[key]) positionalMap[key] = parsed.argv[key];
          argv[key] = parsed.argv[key];
        }
      });
    }
  }

  self.cmdToParseOptions = function (cmdString) {
    const parseOptions: Positionals = {
      array: [],
      default: {},
      alias: {},
      demand: {},
    };

    const parsed = parseCommand(cmdString);
    parsed.demanded.forEach(d => {
      const [cmd, ...aliases] = d.cmd;
      if (d.variadic) {
        parseOptions.array.push(cmd);
        parseOptions.default[cmd] = [];
      }
      parseOptions.alias[cmd] = aliases;
      parseOptions.demand[cmd] = true;
    });

    parsed.optional.forEach(o => {
      const [cmd, ...aliases] = o.cmd;
      if (o.variadic) {
        parseOptions.array.push(cmd);
        parseOptions.default[cmd] = [];
      }
      parseOptions.alias[cmd] = aliases;
    });

    return parseOptions;
  };

  self.reset = () => {
    handlers = {};
    aliasMap = {};
    defaultCommand = undefined;
    return self;
  };

  // used by yargs.parse() to freeze
  // the state of commands such that
  // we can apply .parse() multiple times
  // with the same yargs instance.
  const frozens: FrozenCommandInstance[] = [];
  self.freeze = () => {
    frozens.push({
      handlers,
      aliasMap,
      defaultCommand,
    });
  };
  self.unfreeze = () => {
    const frozen = frozens.pop();
    assertNotStrictEqual(frozen, undefined, shim);
    ({handlers, aliasMap, defaultCommand} = frozen);
  };

  return self;
}

/** Instance of the command module. */
export interface CommandInstance {
  addDirectory(
    dir: string,
    context: Context,
    req: Function,
    callerFile: string,
    opts?: RequireDirectoryOptions
  ): void;
  addHandler(
    cmd: string | CommandHandlerDefinition | DefinitionOrCommandName[],
    description?: CommandHandler['description'],
    builder?: CommandBuilderDefinition | CommandBuilder,
    handler?: CommandHandlerCallback,
    commandMiddleware?: Middleware[],
    deprecated?: boolean
  ): void;
  cmdToParseOptions(cmdString: string): Positionals;
  freeze(): void;
  getCommandHandlers(): Dictionary<CommandHandler>;
  getCommands(): string[];
  hasDefaultCommand(): boolean;
  reset(): CommandInstance;
  runCommand(
    command: string | null,
    yargs: YargsInstance,
    parsed: DetailedArguments,
    commandIndex?: number
  ): Arguments | Promise<Arguments>;
  runDefaultBuilderOn(yargs: YargsInstance): void;
  unfreeze(): void;
}

export interface CommandHandlerDefinition
  extends Partial<
    Pick<
      CommandHandler,
      'deprecated' | 'description' | 'handler' | 'middlewares'
    >
  > {
  aliases?: string[];
  builder?: CommandBuilder | CommandBuilderDefinition;
  command?: string | string[];
  desc?: CommandHandler['description'];
  describe?: CommandHandler['description'];
}

export interface CommandBuilderDefinition {
  builder?: CommandBuilder;
  deprecated?: boolean;
  handler: CommandHandlerCallback;
  middlewares?: Middleware[];
}

export function isCommandBuilderDefinition(
  builder?: CommandBuilder | CommandBuilderDefinition
): builder is CommandBuilderDefinition {
  return (
    typeof builder === 'object' &&
    !!(builder as CommandBuilderDefinition).builder &&
    typeof (builder as CommandBuilderDefinition).handler === 'function'
  );
}

export interface CommandHandlerCallback {
  (argv: Arguments): any;
}

export interface CommandHandler {
  builder: CommandBuilder;
  demanded: Positional[];
  deprecated?: boolean;
  description?: string | false;
  handler: CommandHandlerCallback;
  middlewares: Middleware[];
  optional: Positional[];
  original: string;
}

// To be completed later with other CommandBuilder flavours
export type CommandBuilder =
  | CommandBuilderCallback
  | Dictionary<OptionDefinition>;

interface CommandBuilderCallback {
  (y: YargsInstance): YargsInstance | void;
}

function isCommandAndAliases(
  cmd: DefinitionOrCommandName[]
): cmd is [CommandHandlerDefinition, ...string[]] {
  if (cmd.every(c => typeof c === 'string')) {
    return true;
  } else {
    return false;
  }
}

export function isCommandBuilderCallback(
  builder: CommandBuilder
): builder is CommandBuilderCallback {
  return typeof builder === 'function';
}

function isCommandBuilderOptionDefinitions(
  builder: CommandBuilder
): builder is Dictionary<OptionDefinition> {
  return typeof builder === 'object';
}

export function isCommandHandlerDefinition(
  cmd: DefinitionOrCommandName | [DefinitionOrCommandName, ...string[]]
): cmd is CommandHandlerDefinition {
  return typeof cmd === 'object' && !Array.isArray(cmd);
}

interface Positionals extends Pick<Options, 'alias' | 'array' | 'default'> {
  demand: Dictionary<boolean>;
}

type FrozenCommandInstance = {
  handlers: Dictionary<CommandHandler>;
  aliasMap: Dictionary<string>;
  defaultCommand: CommandHandler | undefined;
};

export interface FinishCommandHandler {
  (handlerResult: any): any;
}
