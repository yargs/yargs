/* eslint-disable @typescript-eslint/no-unused-vars */
// Platform agnostic entrypoint for yargs, i.e., this factory is used to
// create an instance of yargs for CJS, ESM, Deno.
//
// Works by accepting a shim which shims methods that contain platform
// specific logic.
import {
  command as Command,
  CommandInstance,
  CommandHandler,
  CommandBuilderDefinition,
  CommandBuilder,
  CommandHandlerCallback,
  CommandHandlerDefinition,
  FinishCommandHandler,
  DefinitionOrCommandName,
} from './command.js';
import type {
  Dictionary,
  KeyOf,
  DictionaryKeyof,
  ValueOf,
  RequireDirectoryOptions,
  PlatformShim,
  RequireType,
} from './typings/common-types.js';
import {
  assertNotStrictEqual,
  assertSingleKey,
  objectKeys,
} from './typings/common-types.js';
import {
  ArgsOutput,
  DetailedArguments as ParserDetailedArguments,
  Configuration as ParserConfiguration,
  Options as ParserOptions,
  ConfigCallback,
  CoerceCallback,
} from './typings/yargs-parser-types.js';
import {YError} from './yerror.js';
import {UsageInstance, FailureFunction, usage as Usage} from './usage.js';
import {argsert} from './argsert.js';
import {
  completion as Completion,
  CompletionInstance,
  CompletionFunction,
} from './completion.js';
import {
  validation as Validation,
  ValidationInstance,
  KeyOrPos,
} from './validation.js';
import {objFilter} from './utils/obj-filter.js';
import {applyExtends} from './utils/apply-extends.js';
import {
  globalMiddlewareFactory,
  MiddlewareCallback,
  Middleware,
} from './middleware.js';
import {isPromise} from './utils/is-promise.js';
import setBlocking from './utils/set-blocking.js';

let shim: PlatformShim;
export function YargsWithShim(_shim: PlatformShim) {
  shim = _shim;
  return Yargs;
}

function Yargs(
  processArgs: string | string[] = [],
  cwd = shim.process.cwd(),
  parentRequire?: RequireType
): YargsInstance {
  const self = {} as YargsInstance;
  let command: CommandInstance;
  let completion: CompletionInstance | null = null;
  let groups: Dictionary<string[]> = {};
  const globalMiddleware: Middleware[] = [];
  let output = '';
  const preservedGroups: Dictionary<string[]> = {};
  let usage: UsageInstance;
  let validation: ValidationInstance;
  let handlerFinishCommand: FinishCommandHandler | null = null;

  const y18n = shim.y18n;

  self.middleware = globalMiddlewareFactory(globalMiddleware, self);

  self.scriptName = function (scriptName) {
    self.customScriptName = true;
    self.$0 = scriptName;
    return self;
  };

  // ignore the node bin, specify this in your
  // bin file with #!/usr/bin/env node
  let default$0: string[];
  if (/\b(node|iojs|electron)(\.exe)?$/.test(shim.process.argv()[0])) {
    default$0 = shim.process.argv().slice(1, 2);
  } else {
    default$0 = shim.process.argv().slice(0, 1);
  }

  self.$0 = default$0
    .map(x => {
      const b = rebase(cwd, x);
      return x.match(/^(\/|([a-zA-Z]:)?\\)/) && b.length < x.length ? b : x;
    })
    .join(' ')
    .trim();

  if (shim.getEnv('_') && shim.getProcessArgvBin() === shim.getEnv('_')) {
    self.$0 = shim
      .getEnv('_')!
      .replace(`${shim.path.dirname(shim.process.execPath())}/`, '');
  }

  // use context object to keep track of resets, subcommand execution, etc
  // submodules should modify and check the state of context as necessary
  const context = {resets: -1, commands: [], fullCommands: [], files: []};
  self.getContext = () => context;

  let hasOutput = false;
  let exitError: YError | string | undefined | null = null;
  // maybe exit, always capture
  // context about why we wanted to exit.
  self.exit = (code, err) => {
    hasOutput = true;
    exitError = err;
    if (exitProcess) shim.process.exit(code);
  };

  let completionCommand: string | null = null;
  self.completion = function (
    cmd?: string,
    desc?: string | false | CompletionFunction,
    fn?: CompletionFunction
  ) {
    argsert(
      '[string] [string|boolean|function] [function]',
      [cmd, desc, fn],
      arguments.length
    );

    // a function to execute when generating
    // completions can be provided as the second
    // or third argument to completion.
    if (typeof desc === 'function') {
      fn = desc;
      desc = undefined;
    }

    // register the completion command.
    completionCommand = cmd || completionCommand || 'completion';
    if (!desc && desc !== false) {
      desc = 'generate completion script';
    }
    self.command(completionCommand, desc);

    // a function can be provided
    if (fn) completion!.registerFunction(fn);

    return self;
  };

  // puts yargs back into an initial state. any keys
  // that have been set to "global" will not be reset
  // by this action.
  let options: Options;
  self.resetOptions = self.reset = function resetOptions(aliases = {}) {
    context.resets++;
    options = options || {};
    // put yargs back into an initial state, this
    // logic is used to build a nested command
    // hierarchy.
    const tmpOptions = {} as Options;
    tmpOptions.local = options.local ? options.local : [];
    tmpOptions.configObjects = options.configObjects
      ? options.configObjects
      : [];

    // if a key has been explicitly set as local,
    // we should reset it before passing options to command.
    const localLookup: Dictionary<boolean> = {};
    tmpOptions.local.forEach(l => {
      localLookup[l] = true;
      (aliases[l] || []).forEach(a => {
        localLookup[a] = true;
      });
    });

    // add all groups not set to local to preserved groups
    Object.assign(
      preservedGroups,
      Object.keys(groups).reduce((acc, groupName) => {
        const keys = groups[groupName].filter(key => !(key in localLookup));
        if (keys.length > 0) {
          acc[groupName] = keys;
        }
        return acc;
      }, {} as Dictionary<string[]>)
    );
    // groups can now be reset
    groups = {};

    const arrayOptions: KeyOf<Options, string[]>[] = [
      'array',
      'boolean',
      'string',
      'skipValidation',
      'count',
      'normalize',
      'number',
      'hiddenOptions',
    ];

    const objectOptions: DictionaryKeyof<Options>[] = [
      'narg',
      'key',
      'alias',
      'default',
      'defaultDescription',
      'config',
      'choices',
      'demandedOptions',
      'demandedCommands',
      'coerce',
      'deprecatedOptions',
    ];

    arrayOptions.forEach(k => {
      tmpOptions[k] = (options[k] || []).filter((k: string) => !localLookup[k]);
    });

    objectOptions.forEach(<K extends DictionaryKeyof<Options>>(k: K) => {
      tmpOptions[k] = objFilter(options[k], k => !localLookup[k as string]);
    });

    tmpOptions.envPrefix = options.envPrefix;
    options = tmpOptions;

    // if this is the first time being executed, create
    // instances of all our helpers -- otherwise just reset.
    usage = usage ? usage.reset(localLookup) : Usage(self, y18n, shim);
    validation = validation
      ? validation.reset(localLookup)
      : Validation(self, usage, y18n, shim);
    command = command
      ? command.reset()
      : Command(self, usage, validation, globalMiddleware, shim);
    if (!completion) completion = Completion(self, usage, command, shim);

    completionCommand = null;
    output = '';
    exitError = null;
    hasOutput = false;
    self.parsed = false;

    return self;
  };
  self.resetOptions();

  // temporary hack: allow "freezing" of reset-able state for parse(msg, cb)
  const frozens: FrozenYargsInstance[] = [];
  function freeze() {
    frozens.push({
      options,
      configObjects: options.configObjects.slice(0),
      exitProcess,
      groups,
      strict,
      strictCommands,
      strictOptions,
      completionCommand,
      output,
      exitError,
      hasOutput,
      parsed: self.parsed,
      parseFn,
      parseContext,
      handlerFinishCommand,
    });
    usage.freeze();
    validation.freeze();
    command.freeze();
  }
  function unfreeze() {
    const frozen = frozens.pop();
    assertNotStrictEqual(frozen, undefined, shim);
    let configObjects: Dictionary[];
    ({
      options,
      configObjects,
      exitProcess,
      groups,
      output,
      exitError,
      hasOutput,
      parsed: self.parsed,
      strict,
      strictCommands,
      strictOptions,
      completionCommand,
      parseFn,
      parseContext,
      handlerFinishCommand,
    } = frozen);
    options.configObjects = configObjects;
    usage.unfreeze();
    validation.unfreeze();
    command.unfreeze();
  }

  self.boolean = function (keys) {
    argsert('<array|string>', [keys], arguments.length);
    populateParserHintArray('boolean', keys);
    return self;
  };

  self.array = function (keys) {
    argsert('<array|string>', [keys], arguments.length);
    populateParserHintArray('array', keys);
    return self;
  };

  self.number = function (keys) {
    argsert('<array|string>', [keys], arguments.length);
    populateParserHintArray('number', keys);
    return self;
  };

  self.normalize = function (keys) {
    argsert('<array|string>', [keys], arguments.length);
    populateParserHintArray('normalize', keys);
    return self;
  };

  self.count = function (keys) {
    argsert('<array|string>', [keys], arguments.length);
    populateParserHintArray('count', keys);
    return self;
  };

  self.string = function (keys) {
    argsert('<array|string>', [keys], arguments.length);
    populateParserHintArray('string', keys);
    return self;
  };

  self.requiresArg = function (keys) {
    // the 2nd paramter [number] in the argsert the assertion is mandatory
    // as populateParserHintSingleValueDictionary recursively calls requiresArg
    // with Nan as a 2nd parameter, although we ignore it
    argsert('<array|string|object> [number]', [keys], arguments.length);
    // If someone configures nargs at the same time as requiresArg,
    // nargs should take precedent,
    // see: https://github.com/yargs/yargs/pull/1572
    // TODO: make this work with aliases, using a check similar to
    // checkAllAliases() in yargs-parser.
    if (typeof keys === 'string' && options.narg[keys]) {
      return self;
    } else {
      populateParserHintSingleValueDictionary(
        self.requiresArg,
        'narg',
        keys,
        NaN
      );
    }
    return self;
  };

  self.skipValidation = function (keys) {
    argsert('<array|string>', [keys], arguments.length);
    populateParserHintArray('skipValidation', keys);
    return self;
  };

  function populateParserHintArray<T extends KeyOf<Options, string[]>>(
    type: T,
    keys: string | string[]
  ) {
    keys = ([] as string[]).concat(keys);
    keys.forEach(key => {
      key = sanitizeKey(key);
      options[type].push(key);
    });
  }

  self.nargs = function (
    key: string | string[] | Dictionary<number>,
    value?: number
  ) {
    argsert('<string|object|array> [number]', [key, value], arguments.length);
    populateParserHintSingleValueDictionary(self.nargs, 'narg', key, value);
    return self;
  };

  self.choices = function (
    key: string | string[] | Dictionary<string | string[]>,
    value?: string | string[]
  ) {
    argsert(
      '<object|string|array> [string|array]',
      [key, value],
      arguments.length
    );
    populateParserHintArrayDictionary(self.choices, 'choices', key, value);
    return self;
  };

  self.alias = function (
    key: string | string[] | Dictionary<string | string[]>,
    value?: string | string[]
  ) {
    argsert(
      '<object|string|array> [string|array]',
      [key, value],
      arguments.length
    );
    populateParserHintArrayDictionary(self.alias, 'alias', key, value);
    return self;
  };

  // TODO: actually deprecate self.defaults.
  self.default = self.defaults = function (
    key: string | string[] | Dictionary<any>,
    value?: any,
    defaultDescription?: string
  ) {
    argsert(
      '<object|string|array> [*] [string]',
      [key, value, defaultDescription],
      arguments.length
    );
    if (defaultDescription) {
      assertSingleKey(key, shim);
      options.defaultDescription[key] = defaultDescription;
    }
    if (typeof value === 'function') {
      assertSingleKey(key, shim);
      if (!options.defaultDescription[key])
        options.defaultDescription[key] = usage.functionDescription(value);
      value = value.call();
    }
    populateParserHintSingleValueDictionary<'default'>(
      self.default,
      'default',
      key,
      value
    );
    return self;
  };

  self.describe = function (
    key: string | string[] | Dictionary<string>,
    desc?: string
  ) {
    argsert('<object|string|array> [string]', [key, desc], arguments.length);
    setKey(key, true);
    usage.describe(key, desc);
    return self;
  };

  function setKey(
    key: string | string[] | Dictionary<string | boolean>,
    set?: boolean | string
  ) {
    populateParserHintSingleValueDictionary(setKey, 'key', key, set);
    return self;
  }

  function demandOption(
    keys: string | string[] | Dictionary<string | undefined>,
    msg?: string
  ) {
    argsert('<object|string|array> [string]', [keys, msg], arguments.length);
    populateParserHintSingleValueDictionary(
      self.demandOption,
      'demandedOptions',
      keys,
      msg
    );
    return self;
  }
  self.demandOption = demandOption;

  self.coerce = function (
    keys: string | string[] | Dictionary<CoerceCallback>,
    value?: CoerceCallback
  ) {
    argsert(
      '<object|string|array> [function]',
      [keys, value],
      arguments.length
    );
    populateParserHintSingleValueDictionary(self.coerce, 'coerce', keys, value);
    return self;
  };

  function populateParserHintSingleValueDictionary<
    T extends
      | Exclude<DictionaryKeyof<Options>, DictionaryKeyof<Options, any[]>>
      | 'default',
    K extends keyof Options[T] & string = keyof Options[T] & string,
    V extends ValueOf<Options[T]> = ValueOf<Options[T]>
  >(
    builder: (key: K, value: V, ...otherArgs: any[]) => YargsInstance,
    type: T,
    key: K | K[] | {[key in K]: V},
    value?: V
  ) {
    populateParserHintDictionary<T, K, V>(
      builder,
      type,
      key,
      value,
      (type, key, value) => {
        options[type][key] = value as ValueOf<Options[T]>;
      }
    );
  }

  function populateParserHintArrayDictionary<
    T extends DictionaryKeyof<Options, any[]>,
    K extends keyof Options[T] & string = keyof Options[T] & string,
    V extends ValueOf<ValueOf<Options[T]>> | ValueOf<ValueOf<Options[T]>>[] =
      | ValueOf<ValueOf<Options[T]>>
      | ValueOf<ValueOf<Options[T]>>[]
  >(
    builder: (key: K, value: V, ...otherArgs: any[]) => YargsInstance,
    type: T,
    key: K | K[] | {[key in K]: V},
    value?: V
  ) {
    populateParserHintDictionary<T, K, V>(
      builder,
      type,
      key,
      value,
      (type, key, value) => {
        options[type][key] = (
          options[type][key] || ([] as Options[T][keyof Options[T]])
        ).concat(value);
      }
    );
  }

  function populateParserHintDictionary<
    T extends keyof Options,
    K extends keyof Options[T],
    V
  >(
    builder: (key: K, value: V, ...otherArgs: any[]) => YargsInstance,
    type: T,
    key: K | K[] | {[key in K]: V},
    value: V | undefined,
    singleKeyHandler: (type: T, key: K, value?: V) => void
  ) {
    if (Array.isArray(key)) {
      // an array of keys with one value ['x', 'y', 'z'], function parse () {}
      key.forEach(k => {
        builder(k, value!);
      });
    } else if (
      ((key): key is {[key in K]: V} => typeof key === 'object')(key)
    ) {
      // an object of key value pairs: {'x': parse () {}, 'y': parse() {}}
      for (const k of objectKeys(key)) {
        builder(k, key[k]);
      }
    } else {
      singleKeyHandler(type, sanitizeKey(key), value);
    }
  }

  // TODO(bcoe): in future major versions move more objects towards
  // Object.create(null):
  function sanitizeKey<K extends any>(key: K): K;
  function sanitizeKey(key: '__proto__'): '___proto___';
  function sanitizeKey(key: any) {
    if (key === '__proto__') return '___proto___';
    return key;
  }

  function deleteFromParserHintObject(optionKey: string) {
    // delete from all parsing hints:
    // boolean, array, key, alias, etc.
    objectKeys(options).forEach((hintKey: keyof Options) => {
      // configObjects is not a parsing hint array
      if (((key): key is 'configObjects' => key === 'configObjects')(hintKey))
        return;
      const hint = options[hintKey];
      if (Array.isArray(hint)) {
        if (~hint.indexOf(optionKey)) hint.splice(hint.indexOf(optionKey), 1);
      } else if (typeof hint === 'object') {
        delete (hint as Dictionary)[optionKey];
      }
    });
    // now delete the description from usage.js.
    delete usage.getDescriptions()[optionKey];
  }

  self.config = function config(
    key: string | string[] | Dictionary = 'config',
    msg?: string | ConfigCallback,
    parseFn?: ConfigCallback
  ) {
    argsert(
      '[object|string] [string|function] [function]',
      [key, msg, parseFn],
      arguments.length
    );
    // allow a config object to be provided directly.
    if (typeof key === 'object' && !Array.isArray(key)) {
      key = applyExtends(
        key,
        cwd,
        self.getParserConfiguration()['deep-merge-config'] || false,
        shim
      );
      options.configObjects = (options.configObjects || []).concat(key);
      return self;
    }

    // allow for a custom parsing function.
    if (typeof msg === 'function') {
      parseFn = msg;
      msg = undefined;
    }

    self.describe(
      key,
      msg || usage.deferY18nLookup('Path to JSON config file')
    );
    (Array.isArray(key) ? key : [key]).forEach(k => {
      options.config[k] = parseFn || true;
    });

    return self;
  };

  self.example = function (
    cmd: string | [string, string?][],
    description?: string
  ) {
    argsert('<string|array> [string]', [cmd, description], arguments.length);

    if (Array.isArray(cmd)) {
      cmd.forEach(exampleParams => self.example(...exampleParams));
    } else {
      usage.example(cmd, description);
    }

    return self;
  };

  self.command = function (
    cmd: string | CommandHandlerDefinition | DefinitionOrCommandName[],
    description?: CommandHandler['description'],
    builder?: CommandBuilderDefinition | CommandBuilder,
    handler?: CommandHandlerCallback,
    middlewares?: Middleware[],
    deprecated?: boolean
  ) {
    argsert(
      '<string|array|object> [string|boolean] [function|object] [function] [array] [boolean|string]',
      [cmd, description, builder, handler, middlewares, deprecated],
      arguments.length
    );
    command.addHandler(
      cmd,
      description,
      builder,
      handler,
      middlewares,
      deprecated
    );
    return self;
  };

  self.commandDir = function (dir, opts) {
    argsert('<string> [object]', [dir, opts], arguments.length);
    const req = parentRequire || shim.require;
    command.addDirectory(
      dir,
      self.getContext(),
      req,
      shim.getCallerFile(),
      opts
    );
    return self;
  };

  // TODO: deprecate self.demand in favor of
  // .demandCommand() .demandOption().
  self.demand = self.required = self.require = function demand(
    keys: string | string[] | Dictionary<string | undefined> | number,
    max?: number | string[] | string | true,
    msg?: string | true
  ) {
    // you can optionally provide a 'max' key,
    // which will raise an exception if too many '_'
    // options are provided.
    if (Array.isArray(max)) {
      max.forEach(key => {
        assertNotStrictEqual(msg, true as const, shim);
        demandOption(key, msg);
      });
      max = Infinity;
    } else if (typeof max !== 'number') {
      msg = max;
      max = Infinity;
    }

    if (typeof keys === 'number') {
      assertNotStrictEqual(msg, true as const, shim);
      self.demandCommand(keys, max, msg, msg);
    } else if (Array.isArray(keys)) {
      keys.forEach(key => {
        assertNotStrictEqual(msg, true as const, shim);
        demandOption(key, msg);
      });
    } else {
      if (typeof msg === 'string') {
        demandOption(keys, msg);
      } else if (msg === true || typeof msg === 'undefined') {
        demandOption(keys);
      }
    }

    return self;
  };

  self.demandCommand = function demandCommand(
    min = 1,
    max?: number | string,
    minMsg?: string | null,
    maxMsg?: string | null
  ) {
    argsert(
      '[number] [number|string] [string|null|undefined] [string|null|undefined]',
      [min, max, minMsg, maxMsg],
      arguments.length
    );

    if (typeof max !== 'number') {
      minMsg = max;
      max = Infinity;
    }

    self.global('_', false);

    options.demandedCommands._ = {
      min,
      max,
      minMsg,
      maxMsg,
    };

    return self;
  };

  self.getDemandedOptions = () => {
    argsert([], 0);
    return options.demandedOptions;
  };

  self.getDemandedCommands = () => {
    argsert([], 0);
    return options.demandedCommands;
  };

  self.deprecateOption = function deprecateOption(option, message) {
    argsert('<string> [string|boolean]', [option, message], arguments.length);
    options.deprecatedOptions[option] = message;
    return self;
  };

  self.getDeprecatedOptions = () => {
    argsert([], 0);
    return options.deprecatedOptions;
  };

  self.implies = function (
    key: string | Dictionary<KeyOrPos | KeyOrPos[]>,
    value?: KeyOrPos | KeyOrPos[]
  ) {
    argsert(
      '<string|object> [number|string|array]',
      [key, value],
      arguments.length
    );
    validation.implies(key, value);
    return self;
  };

  self.conflicts = function (
    key1: string | Dictionary<string | string[]>,
    key2?: string | string[]
  ) {
    argsert('<string|object> [string|array]', [key1, key2], arguments.length);
    validation.conflicts(key1, key2);
    return self;
  };

  self.usage = function (
    msg: string | null,
    description?: CommandHandler['description'],
    builder?: CommandBuilderDefinition | CommandBuilder,
    handler?: CommandHandlerCallback
  ) {
    argsert(
      '<string|null|undefined> [string|boolean] [function|object] [function]',
      [msg, description, builder, handler],
      arguments.length
    );

    if (description !== undefined) {
      assertNotStrictEqual(msg, null, shim);
      // .usage() can be used as an alias for defining
      // a default command.
      if ((msg || '').match(/^\$0( |$)/)) {
        return self.command(msg, description, builder, handler);
      } else {
        throw new YError(
          '.usage() description must start with $0 if being used as alias for .command()'
        );
      }
    } else {
      usage.usage(msg);
      return self;
    }
  };

  self.epilogue = self.epilog = function (msg) {
    argsert('<string>', [msg], arguments.length);
    usage.epilog(msg);
    return self;
  };

  self.fail = function (f) {
    argsert('<function>', [f], arguments.length);
    usage.failFn(f);
    return self;
  };

  self.onFinishCommand = function (f) {
    argsert('<function>', [f], arguments.length);
    handlerFinishCommand = f;
    return self;
  };

  self.getHandlerFinishCommand = () => handlerFinishCommand;

  self.check = function (f, _global) {
    argsert('<function> [boolean]', [f, _global], arguments.length);
    validation.check(f, _global !== false);
    return self;
  };

  self.global = function global(globals, global) {
    argsert('<string|array> [boolean]', [globals, global], arguments.length);
    globals = ([] as string[]).concat(globals);
    if (global !== false) {
      options.local = options.local.filter(l => globals.indexOf(l) === -1);
    } else {
      globals.forEach(g => {
        if (options.local.indexOf(g) === -1) options.local.push(g);
      });
    }
    return self;
  };

  self.pkgConf = function pkgConf(key, rootPath) {
    argsert('<string> [string]', [key, rootPath], arguments.length);
    let conf = null;
    // prefer cwd to require-main-filename in this method
    // since we're looking for e.g. "nyc" config in nyc consumer
    // rather than "yargs" config in nyc (where nyc is the main filename)
    const obj = pkgUp(rootPath || cwd);

    // If an object exists in the key, add it to options.configObjects
    if (obj[key] && typeof obj[key] === 'object') {
      conf = applyExtends(
        obj[key],
        rootPath || cwd,
        self.getParserConfiguration()['deep-merge-config'] || false,
        shim
      );
      options.configObjects = (options.configObjects || []).concat(conf);
    }

    return self;
  };

  const pkgs: Dictionary = {};
  function pkgUp(rootPath?: string) {
    const npath = rootPath || '*';
    if (pkgs[npath]) return pkgs[npath];

    let obj = {};
    try {
      let startDir = rootPath || shim.mainFilename;

      // When called in an environment that lacks require.main.filename, such as a jest test runner,
      // startDir is already process.cwd(), and should not be shortened.
      // Whether or not it is _actually_ a directory (e.g., extensionless bin) is irrelevant, find-up handles it.
      if (!rootPath && shim.path.extname(startDir)) {
        startDir = shim.path.dirname(startDir);
      }

      const pkgJsonPath = shim.findUp(
        startDir,
        (dir: string[], names: string[]) => {
          if (names.includes('package.json')) {
            return 'package.json';
          } else {
            return undefined;
          }
        }
      );
      assertNotStrictEqual(pkgJsonPath, undefined, shim);
      obj = JSON.parse(shim.readFileSync(pkgJsonPath, 'utf8'));
      // eslint-disable-next-line no-empty
    } catch (_noop) {}

    pkgs[npath] = obj || {};
    return pkgs[npath];
  }

  let parseFn: ParseCallback | null = null;
  let parseContext: object | null = null;
  self.parse = function parse(
    args?: string | string[],
    shortCircuit?: object | ParseCallback | boolean,
    _parseFn?: ParseCallback
  ) {
    argsert(
      '[string|array] [function|boolean|object] [function]',
      [args, shortCircuit, _parseFn],
      arguments.length
    );
    freeze();
    if (typeof args === 'undefined') {
      const argv = self._parseArgs(processArgs);
      const tmpParsed = self.parsed;
      unfreeze();
      // TODO: remove this compatibility hack when we release yargs@15.x:
      self.parsed = tmpParsed;
      return argv;
    }

    // a context object can optionally be provided, this allows
    // additional information to be passed to a command handler.
    if (typeof shortCircuit === 'object') {
      parseContext = shortCircuit;
      shortCircuit = _parseFn;
    }

    // by providing a function as a second argument to
    // parse you can capture output that would otherwise
    // default to printing to stdout/stderr.
    if (typeof shortCircuit === 'function') {
      parseFn = shortCircuit as ParseCallback;
      shortCircuit = false;
    }
    // completion short-circuits the parsing process,
    // skipping validation, etc.
    if (!shortCircuit) processArgs = args;

    if (parseFn) exitProcess = false;

    const parsed = self._parseArgs(args, !!shortCircuit);
    completion!.setParsed(self.parsed as DetailedArguments);
    if (parseFn) parseFn(exitError, parsed, output);
    unfreeze();

    return parsed;
  };

  self._getParseContext = () => parseContext || {};

  self._hasParseCallback = () => !!parseFn;

  self.option = self.options = function option(
    key: string | Dictionary<OptionDefinition>,
    opt?: OptionDefinition
  ) {
    argsert('<string|object> [object]', [key, opt], arguments.length);
    if (typeof key === 'object') {
      Object.keys(key).forEach(k => {
        self.options(k, key[k]);
      });
    } else {
      if (typeof opt !== 'object') {
        opt = {};
      }

      options.key[key] = true; // track manually set keys.

      if (opt.alias) self.alias(key, opt.alias);

      const deprecate = opt.deprecate || opt.deprecated;

      if (deprecate) {
        self.deprecateOption(key, deprecate);
      }

      const demand = opt.demand || opt.required || opt.require;

      // A required option can be specified via "demand: true".
      if (demand) {
        self.demand(key, demand);
      }

      if (opt.demandOption) {
        self.demandOption(
          key,
          typeof opt.demandOption === 'string' ? opt.demandOption : undefined
        );
      }

      if (opt.conflicts) {
        self.conflicts(key, opt.conflicts);
      }

      if ('default' in opt) {
        self.default(key, opt.default);
      }

      if (opt.implies !== undefined) {
        self.implies(key, opt.implies);
      }

      if (opt.nargs !== undefined) {
        self.nargs(key, opt.nargs);
      }

      if (opt.config) {
        self.config(key, opt.configParser);
      }

      if (opt.normalize) {
        self.normalize(key);
      }

      if (opt.choices) {
        self.choices(key, opt.choices);
      }

      if (opt.coerce) {
        self.coerce(key, opt.coerce);
      }

      if (opt.group) {
        self.group(key, opt.group);
      }

      if (opt.boolean || opt.type === 'boolean') {
        self.boolean(key);
        if (opt.alias) self.boolean(opt.alias);
      }

      if (opt.array || opt.type === 'array') {
        self.array(key);
        if (opt.alias) self.array(opt.alias);
      }

      if (opt.number || opt.type === 'number') {
        self.number(key);
        if (opt.alias) self.number(opt.alias);
      }

      if (opt.string || opt.type === 'string') {
        self.string(key);
        if (opt.alias) self.string(opt.alias);
      }

      if (opt.count || opt.type === 'count') {
        self.count(key);
      }

      if (typeof opt.global === 'boolean') {
        self.global(key, opt.global);
      }

      if (opt.defaultDescription) {
        options.defaultDescription[key] = opt.defaultDescription;
      }

      if (opt.skipValidation) {
        self.skipValidation(key);
      }

      const desc = opt.describe || opt.description || opt.desc;
      self.describe(key, desc);
      if (opt.hidden) {
        self.hide(key);
      }

      if (opt.requiresArg) {
        self.requiresArg(key);
      }
    }

    return self;
  };
  self.getOptions = () => options;

  self.positional = function (key, opts) {
    argsert('<string> <object>', [key, opts], arguments.length);
    if (context.resets === 0) {
      throw new YError(
        ".positional() can only be called in a command's builder function"
      );
    }

    // .positional() only supports a subset of the configuration
    // options available to .option().
    const supportedOpts: (keyof PositionalDefinition)[] = [
      'default',
      'defaultDescription',
      'implies',
      'normalize',
      'choices',
      'conflicts',
      'coerce',
      'type',
      'describe',
      'desc',
      'description',
      'alias',
    ];
    opts = objFilter(opts, (k, v) => {
      let accept = supportedOpts.indexOf(k) !== -1;
      // type can be one of string|number|boolean.
      if (k === 'type' && ['string', 'number', 'boolean'].indexOf(v) === -1)
        accept = false;
      return accept;
    });

    // copy over any settings that can be inferred from the command string.
    const fullCommand = context.fullCommands[context.fullCommands.length - 1];
    const parseOptions = fullCommand
      ? command.cmdToParseOptions(fullCommand)
      : {
          array: [],
          alias: {},
          default: {},
          demand: {},
        };
    objectKeys(parseOptions).forEach(pk => {
      const parseOption = parseOptions[pk];
      if (Array.isArray(parseOption)) {
        if (parseOption.indexOf(key) !== -1) opts[pk] = true;
      } else {
        if (parseOption[key] && !(pk in opts)) opts[pk] = parseOption[key];
      }
    });
    self.group(key, usage.getPositionalGroupName());
    return self.option(key, opts);
  };

  self.group = function group(opts, groupName) {
    argsert('<string|array> <string>', [opts, groupName], arguments.length);
    const existing = preservedGroups[groupName] || groups[groupName];
    if (preservedGroups[groupName]) {
      // we now only need to track this group name in groups.
      delete preservedGroups[groupName];
    }

    const seen: Dictionary<boolean> = {};
    groups[groupName] = (existing || []).concat(opts).filter(key => {
      if (seen[key]) return false;
      return (seen[key] = true);
    });
    return self;
  };
  // combine explicit and preserved groups. explicit groups should be first
  self.getGroups = () => Object.assign({}, groups, preservedGroups);

  // as long as options.envPrefix is not undefined,
  // parser will apply env vars matching prefix to argv
  self.env = function (prefix) {
    argsert('[string|boolean]', [prefix], arguments.length);
    if (prefix === false) delete options.envPrefix;
    else options.envPrefix = prefix || '';
    return self;
  };

  self.wrap = function (cols) {
    argsert('<number|null|undefined>', [cols], arguments.length);
    usage.wrap(cols);
    return self;
  };

  let strict = false;
  self.strict = function (enabled) {
    argsert('[boolean]', [enabled], arguments.length);
    strict = enabled !== false;
    return self;
  };
  self.getStrict = () => strict;

  let strictCommands = false;
  self.strictCommands = function (enabled) {
    argsert('[boolean]', [enabled], arguments.length);
    strictCommands = enabled !== false;
    return self;
  };
  self.getStrictCommands = () => strictCommands;

  let strictOptions = false;
  self.strictOptions = function (enabled) {
    argsert('[boolean]', [enabled], arguments.length);
    strictOptions = enabled !== false;
    return self;
  };
  self.getStrictOptions = () => strictOptions;

  let parserConfig: Configuration = {};
  self.parserConfiguration = function parserConfiguration(config) {
    argsert('<object>', [config], arguments.length);
    parserConfig = config;
    return self;
  };
  self.getParserConfiguration = () => parserConfig;

  self.showHelp = function (level) {
    argsert('[string|function]', [level], arguments.length);
    if (!self.parsed) self._parseArgs(processArgs); // run parser, if it has not already been executed.
    if (command.hasDefaultCommand()) {
      context.resets++; // override the restriction on top-level positoinals.
      command.runDefaultBuilderOn(self);
    }
    usage.showHelp(level);
    return self;
  };

  let versionOpt: string | null = null;
  self.version = function version(
    opt?: string | false,
    msg?: string,
    ver?: string
  ) {
    const defaultVersionOpt = 'version';
    argsert(
      '[boolean|string] [string] [string]',
      [opt, msg, ver],
      arguments.length
    );

    // nuke the key previously configured
    // to return version #.
    if (versionOpt) {
      deleteFromParserHintObject(versionOpt);
      usage.version(undefined);
      versionOpt = null;
    }

    if (arguments.length === 0) {
      ver = guessVersion();
      opt = defaultVersionOpt;
    } else if (arguments.length === 1) {
      if (opt === false) {
        // disable default 'version' key.
        return self;
      }
      ver = opt;
      opt = defaultVersionOpt;
    } else if (arguments.length === 2) {
      ver = msg;
      msg = undefined;
    }

    versionOpt = typeof opt === 'string' ? opt : defaultVersionOpt;
    msg = msg || usage.deferY18nLookup('Show version number');

    usage.version(ver || undefined);
    self.boolean(versionOpt);
    self.describe(versionOpt, msg);
    return self;
  };

  function guessVersion() {
    const obj = pkgUp();

    return obj.version || 'unknown';
  }

  let helpOpt: string | null = null;
  self.addHelpOpt = self.help = function addHelpOpt(
    opt?: string | false,
    msg?: string
  ) {
    const defaultHelpOpt = 'help';
    argsert('[string|boolean] [string]', [opt, msg], arguments.length);

    // nuke the key previously configured
    // to return help.
    if (helpOpt) {
      deleteFromParserHintObject(helpOpt);
      helpOpt = null;
    }

    if (arguments.length === 1) {
      if (opt === false) return self;
    }

    // use arguments, fallback to defaults for opt and msg
    helpOpt = typeof opt === 'string' ? opt : defaultHelpOpt;
    self.boolean(helpOpt);
    self.describe(helpOpt, msg || usage.deferY18nLookup('Show help'));
    return self;
  };

  const defaultShowHiddenOpt = 'show-hidden';
  options!.showHiddenOpt = defaultShowHiddenOpt;
  self.addShowHiddenOpt = self.showHidden = function addShowHiddenOpt(
    opt?: string | false,
    msg?: string
  ) {
    argsert('[string|boolean] [string]', [opt, msg], arguments.length);

    if (arguments.length === 1) {
      if (opt === false) return self;
    }

    const showHiddenOpt = typeof opt === 'string' ? opt : defaultShowHiddenOpt;
    self.boolean(showHiddenOpt);
    self.describe(
      showHiddenOpt,
      msg || usage.deferY18nLookup('Show hidden options')
    );
    options.showHiddenOpt = showHiddenOpt;
    return self;
  };

  self.hide = function hide(key) {
    argsert('<string>', [key], arguments.length);
    options.hiddenOptions.push(key);
    return self;
  };

  self.showHelpOnFail = function showHelpOnFail(
    enabled?: string | boolean,
    message?: string
  ) {
    argsert('[boolean|string] [string]', [enabled, message], arguments.length);
    usage.showHelpOnFail(enabled, message);
    return self;
  };

  let exitProcess = true;
  self.exitProcess = function (enabled = true) {
    argsert('[boolean]', [enabled], arguments.length);
    exitProcess = enabled;
    return self;
  };
  self.getExitProcess = () => exitProcess;

  self.showCompletionScript = function ($0, cmd) {
    argsert('[string] [string]', [$0, cmd], arguments.length);
    $0 = $0 || self.$0;
    _logger.log(
      completion!.generateCompletionScript(
        $0,
        cmd || completionCommand || 'completion'
      )
    );
    return self;
  };

  self.getCompletion = function (args, done) {
    argsert('<array> <function>', [args, done], arguments.length);
    completion!.getCompletion(args, done);
  };

  self.locale = function (locale?: string): any {
    argsert('[string]', [locale], arguments.length);
    if (!locale) {
      guessLocale();
      return y18n.getLocale();
    }
    detectLocale = false;
    y18n.setLocale(locale);
    return self;
  };

  self.updateStrings = self.updateLocale = function (obj) {
    argsert('<object>', [obj], arguments.length);
    detectLocale = false;
    y18n.updateLocale(obj);
    return self;
  };

  let detectLocale = true;
  self.detectLocale = function (detect) {
    argsert('<boolean>', [detect], arguments.length);
    detectLocale = detect;
    return self;
  };
  self.getDetectLocale = () => detectLocale;

  // we use a custom logger that buffers output,
  // so that we can print to non-CLIs, e.g., chat-bots.
  const _logger = {
    log(...args: any[]) {
      if (!self._hasParseCallback()) console.log(...args);
      hasOutput = true;
      if (output.length) output += '\n';
      output += args.join(' ');
    },
    error(...args: any[]) {
      if (!self._hasParseCallback()) console.error(...args);
      hasOutput = true;
      if (output.length) output += '\n';
      output += args.join(' ');
    },
  };
  self._getLoggerInstance = () => _logger;
  // has yargs output an error our help
  // message in the current execution context.
  self._hasOutput = () => hasOutput;

  self._setHasOutput = () => {
    hasOutput = true;
  };

  let recommendCommands: boolean;
  self.recommendCommands = function (recommend = true) {
    argsert('[boolean]', [recommend], arguments.length);
    recommendCommands = recommend;
    return self;
  };

  self.getUsageInstance = () => usage;

  self.getValidationInstance = () => validation;

  self.getCommandInstance = () => command;

  self.terminalWidth = () => {
    argsert([], 0);
    return shim.process.stdColumns;
  };

  Object.defineProperty(self, 'argv', {
    get: () => self._parseArgs(processArgs),
    enumerable: true,
  });

  self._parseArgs = function parseArgs(
    args: string | string[] | null,
    shortCircuit?: boolean | null,
    _calledFromCommand?: boolean,
    commandIndex?: number
  ) {
    let skipValidation = !!_calledFromCommand;
    args = args || processArgs;

    options.__ = y18n.__;
    options.configuration = self.getParserConfiguration();

    const populateDoubleDash = !!options.configuration['populate--'];
    const config = Object.assign({}, options.configuration, {
      'populate--': true,
    });
    const parsed = shim.Parser.detailed(
      args,
      Object.assign({}, options, {
        configuration: {'parse-positional-numbers': false, ...config},
      })
    ) as DetailedArguments;

    let argv = parsed.argv as Arguments;
    if (parseContext) argv = Object.assign({}, argv, parseContext);
    const aliases = parsed.aliases;

    argv.$0 = self.$0;
    self.parsed = parsed;

    try {
      guessLocale(); // guess locale lazily, so that it can be turned off in chain.

      // while building up the argv object, there
      // are two passes through the parser. If completion
      // is being performed short-circuit on the first pass.
      if (shortCircuit) {
        return self._postProcess(argv, populateDoubleDash, _calledFromCommand);
      }

      // if there's a handler associated with a
      // command defer processing to it.
      if (helpOpt) {
        // consider any multi-char helpOpt alias as a valid help command
        // unless all helpOpt aliases are single-char
        // note that parsed.aliases is a normalized bidirectional map :)
        const helpCmds = [helpOpt]
          .concat(aliases[helpOpt] || [])
          .filter(k => k.length > 1);
        // check if help should trigger and strip it from _.
        if (~helpCmds.indexOf('' + argv._[argv._.length - 1])) {
          argv._.pop();
          argv[helpOpt] = true;
        }
      }

      const handlerKeys = command.getCommands();
      const requestCompletions = completion!.completionKey in argv;
      const skipRecommendation = argv[helpOpt!] || requestCompletions;
      const skipDefaultCommand =
        skipRecommendation &&
        (handlerKeys.length > 1 || handlerKeys[0] !== '$0');

      if (argv._.length) {
        if (handlerKeys.length) {
          let firstUnknownCommand;
          for (let i = commandIndex || 0, cmd; argv._[i] !== undefined; i++) {
            cmd = String(argv._[i]);
            if (~handlerKeys.indexOf(cmd) && cmd !== completionCommand) {
              // commands are executed using a recursive algorithm that executes
              // the deepest command first; we keep track of the position in the
              // argv._ array that is currently being executed.
              const innerArgv = command.runCommand(cmd, self, parsed, i + 1);
              return self._postProcess(innerArgv, populateDoubleDash);
            } else if (!firstUnknownCommand && cmd !== completionCommand) {
              firstUnknownCommand = cmd;
              break;
            }
          }

          // run the default command, if defined
          if (command.hasDefaultCommand() && !skipDefaultCommand) {
            const innerArgv = command.runCommand(null, self, parsed);
            return self._postProcess(innerArgv, populateDoubleDash);
          }

          // recommend a command if recommendCommands() has
          // been enabled, and no commands were found to execute
          if (recommendCommands && firstUnknownCommand && !skipRecommendation) {
            validation.recommendCommands(firstUnknownCommand, handlerKeys);
          }
        }

        // generate a completion script for adding to ~/.bashrc.
        if (
          completionCommand &&
          ~argv._.indexOf(completionCommand) &&
          !requestCompletions
        ) {
          if (exitProcess) setBlocking(true);
          self.showCompletionScript();
          self.exit(0);
        }
      } else if (command.hasDefaultCommand() && !skipDefaultCommand) {
        const innerArgv = command.runCommand(null, self, parsed);
        return self._postProcess(innerArgv, populateDoubleDash);
      }

      // we must run completions first, a user might
      // want to complete the --help or --version option.
      if (requestCompletions) {
        if (exitProcess) setBlocking(true);

        // we allow for asynchronous completions,
        // e.g., loading in a list of commands from an API.
        args = ([] as string[]).concat(args);
        const completionArgs = args.slice(
          args.indexOf(`--${completion!.completionKey}`) + 1
        );
        completion!.getCompletion(completionArgs, completions => {
          (completions || []).forEach(completion => {
            _logger.log(completion);
          });

          self.exit(0);
        });
        return self._postProcess(argv, !populateDoubleDash, _calledFromCommand);
      }

      // Handle 'help' and 'version' options
      // if we haven't already output help!
      if (!hasOutput) {
        Object.keys(argv).forEach(key => {
          if (key === helpOpt && argv[key]) {
            if (exitProcess) setBlocking(true);

            skipValidation = true;
            self.showHelp('log');
            self.exit(0);
          } else if (key === versionOpt && argv[key]) {
            if (exitProcess) setBlocking(true);

            skipValidation = true;
            usage.showVersion();
            self.exit(0);
          }
        });
      }

      // Check if any of the options to skip validation were provided
      if (!skipValidation && options.skipValidation.length > 0) {
        skipValidation = Object.keys(argv).some(
          key => options.skipValidation.indexOf(key) >= 0 && argv[key] === true
        );
      }

      // If the help or version options where used and exitProcess is false,
      // or if explicitly skipped, we won't run validations.
      if (!skipValidation) {
        if (parsed.error) throw new YError(parsed.error.message);

        // if we're executed via bash completion, don't
        // bother with validation.
        if (!requestCompletions) {
          self._runValidation(argv, aliases, {}, parsed.error);
        }
      }
    } catch (err) {
      if (err instanceof YError) usage.fail(err.message, err);
      else throw err;
    }

    return self._postProcess(argv, populateDoubleDash, _calledFromCommand);
  };

  // Applies a couple post processing steps that are easier to perform
  // as a final step, rather than
  self._postProcess = function (
    argv: Arguments | Promise<Arguments>,
    populateDoubleDash: boolean,
    calledFromCommand = false
  ): any {
    if (isPromise(argv)) return argv;
    if (calledFromCommand) return argv;
    if (!populateDoubleDash) {
      argv = self._copyDoubleDash(argv);
    }
    const parsePositionalNumbers =
      self.getParserConfiguration()['parse-positional-numbers'] ||
      self.getParserConfiguration()['parse-positional-numbers'] === undefined;
    if (parsePositionalNumbers) {
      argv = self._parsePositionalNumbers(argv);
    }
    return argv;
  };

  // to simplify the parsing of positionals in commands,
  // we temporarily populate '--' rather than _, with arguments
  // after the '--' directive. After the parse, we copy these back.
  self._copyDoubleDash = function (argv: Arguments): any {
    if (!argv._ || !argv['--']) return argv;
    // eslint-disable-next-line prefer-spread
    argv._.push.apply(argv._, argv['--']);

    // We catch an error here, in case someone has called Object.seal()
    // on the parsed object, see: https://github.com/babel/babel/pull/10733
    try {
      delete argv['--'];
      // eslint-disable-next-line no-empty
    } catch (_err) {}

    return argv;
  };

  // We wait to coerce numbers for positionals until after the initial parse.
  // This allows commands to configure number parsing on a positional by
  // positional basis:
  self._parsePositionalNumbers = function (argv: Arguments): any {
    const args: (string | number)[] = argv['--'] ? argv['--'] : argv._;

    for (let i = 0, arg; (arg = args[i]) !== undefined; i++) {
      if (
        shim.Parser.looksLikeNumber(arg) &&
        Number.isSafeInteger(Math.floor(parseFloat(`${arg}`)))
      ) {
        args[i] = Number(arg);
      }
    }
    return argv;
  };

  self._runValidation = function runValidation(
    argv,
    aliases,
    positionalMap,
    parseErrors,
    isDefaultCommand = false
  ) {
    if (parseErrors) throw new YError(parseErrors.message);
    validation.nonOptionCount(argv);
    validation.requiredArguments(argv);
    let failedStrictCommands = false;
    if (strictCommands) {
      failedStrictCommands = validation.unknownCommands(argv);
    }
    if (strict && !failedStrictCommands) {
      validation.unknownArguments(
        argv,
        aliases,
        positionalMap,
        isDefaultCommand
      );
    } else if (strictOptions) {
      validation.unknownArguments(argv, aliases, {}, false, false);
    }
    validation.customChecks(argv, aliases);
    validation.limitedChoices(argv);
    validation.implications(argv);
    validation.conflicting(argv);
  };

  function guessLocale() {
    if (!detectLocale) return;
    const locale =
      shim.getEnv('LC_ALL') ||
      shim.getEnv('LC_MESSAGES') ||
      shim.getEnv('LANG') ||
      shim.getEnv('LANGUAGE') ||
      'en_US';
    self.locale(locale.replace(/[.:].*/, ''));
  }

  // an app should almost always have --version and --help,
  // if you *really* want to disable this use .help(false)/.version(false).
  self.help();
  self.version();

  return self;
}
// rebase an absolute path to a relative one with respect to a base directory
// exported for tests
export interface RebaseFunction {
  (base: string, dir: string): string;
}

export const rebase: RebaseFunction = (base, dir) =>
  shim.path.relative(base, dir);

/** Instance of the yargs module. */
export interface YargsInstance {
  $0: string;
  argv: Arguments;
  customScriptName: boolean;
  parsed: DetailedArguments | false;
  // The methods below are called after the parse in yargs-parser is complete
  // and perform cleanup on the object generated:
  _postProcess<T extends Arguments | Promise<Arguments>>(
    argv: T,
    populateDoubleDash: boolean,
    calledFromCommand?: boolean
  ): T;
  _copyDoubleDash<T extends Arguments>(argv: T): T;
  _parsePositionalNumbers<T extends Arguments>(argv: T): T;

  _getLoggerInstance(): LoggerInstance;
  _getParseContext(): Object;
  _hasOutput(): boolean;
  _hasParseCallback(): boolean;
  _parseArgs: {
    (
      args: null,
      shortCircuit: null,
      _calledFromCommand: boolean,
      commandIndex?: number
    ): Arguments | Promise<Arguments>;
    (args: string | string[], shortCircuit?: boolean):
      | Arguments
      | Promise<Arguments>;
  };
  _runValidation(
    argv: Arguments,
    aliases: Dictionary<string[]>,
    positionalMap: Dictionary<string[]>,
    parseErrors: Error | null,
    isDefaultCommand?: boolean
  ): void;
  _setHasOutput(): void;
  addHelpOpt: {
    (opt?: string | false): YargsInstance;
    (opt?: string, msg?: string): YargsInstance;
  };
  addShowHiddenOpt: {
    (opt?: string | false): YargsInstance;
    (opt?: string, msg?: string): YargsInstance;
  };
  alias: {
    (keys: string | string[], aliases: string | string[]): YargsInstance;
    (keyAliases: Dictionary<string | string[]>): YargsInstance;
  };
  array(keys: string | string[]): YargsInstance;
  boolean(keys: string | string[]): YargsInstance;
  check(
    f: (argv: Arguments, aliases: Dictionary<string[]>) => any,
    _global?: boolean
  ): YargsInstance;
  choices: {
    (keys: string | string[], choices: string | string[]): YargsInstance;
    (keyChoices: Dictionary<string | string[]>): YargsInstance;
  };
  coerce: {
    (keys: string | string[], coerceCallback: CoerceCallback): YargsInstance;
    (keyCoerceCallbacks: Dictionary<CoerceCallback>): YargsInstance;
  };
  command(handler: CommandHandlerDefinition): YargsInstance;
  command(
    cmd: string | string[],
    description: CommandHandler['description'],
    builder?: CommandBuilderDefinition | CommandBuilder,
    handler?: CommandHandlerCallback,
    commandMiddleware?: Middleware[],
    deprecated?: boolean
  ): YargsInstance;
  commandDir(dir: string, opts?: RequireDirectoryOptions): YargsInstance;
  completion: {
    (cmd?: string, fn?: CompletionFunction): YargsInstance;
    (
      cmd?: string,
      desc?: string | false,
      fn?: CompletionFunction
    ): YargsInstance;
  };
  config: {
    (config: Dictionary): YargsInstance;
    (keys?: string | string[], configCallback?: ConfigCallback): YargsInstance;
    (
      keys?: string | string[],
      msg?: string,
      configCallback?: ConfigCallback
    ): YargsInstance;
  };
  conflicts: {
    (key: string, conflictsWith: string | string[]): YargsInstance;
    (keyConflicts: Dictionary<string | string[]>): YargsInstance;
  };
  count(keys: string | string[]): YargsInstance;
  default: {
    (key: string, value: any, defaultDescription?: string): YargsInstance;
    (keys: string[], value: Exclude<any, Function>): YargsInstance;
    (keys: Dictionary<any>): YargsInstance;
  };
  defaults: YargsInstance['default'];
  demand: {
    (min: number, max?: number | string, msg?: string): YargsInstance;
    (keys: string | string[], msg?: string | true): YargsInstance;
    (
      keys: string | string[],
      max: string[],
      msg?: string | true
    ): YargsInstance;
    (keyMsgs: Dictionary<string | undefined>): YargsInstance;
    (
      keyMsgs: Dictionary<string | undefined>,
      max: string[],
      msg?: string
    ): YargsInstance;
  };
  demandCommand(): YargsInstance;
  demandCommand(min: number, minMsg?: string): YargsInstance;
  demandCommand(
    min: number,
    max: number,
    minMsg?: string | null,
    maxMsg?: string | null
  ): YargsInstance;
  demandOption: {
    (keys: string | string[], msg?: string): YargsInstance;
    (keyMsgs: Dictionary<string | undefined>): YargsInstance;
  };
  deprecateOption(option: string, message?: string | boolean): YargsInstance;
  describe: {
    (keys: string | string[], description?: string): YargsInstance;
    (keyDescriptions: Dictionary<string>): YargsInstance;
  };
  detectLocale(detect: boolean): YargsInstance;
  env(prefix?: string | false): YargsInstance;
  epilog: YargsInstance['epilogue'];
  epilogue(msg: string): YargsInstance;
  example(
    cmd: string | [string, string?][],
    description?: string
  ): YargsInstance;
  exit(code: number, err?: YError | string): void;
  exitProcess(enabled: boolean): YargsInstance;
  fail(f: FailureFunction): YargsInstance;
  getCommandInstance(): CommandInstance;
  getCompletion(args: string[], done: (completions: string[]) => any): void;
  getContext(): Context;
  getDemandedCommands(): Options['demandedCommands'];
  getDemandedOptions(): Options['demandedOptions'];
  getDeprecatedOptions(): Options['deprecatedOptions'];
  getDetectLocale(): boolean;
  getExitProcess(): boolean;
  getGroups(): Dictionary<string[]>;
  getHandlerFinishCommand(): FinishCommandHandler | null;
  getOptions(): Options;
  getParserConfiguration(): Configuration;
  getStrict(): boolean;
  getStrictCommands(): boolean;
  getStrictOptions(): boolean;
  getUsageInstance(): UsageInstance;
  getValidationInstance(): ValidationInstance;
  global(keys: string | string[], global?: boolean): YargsInstance;
  group(keys: string | string[], groupName: string): YargsInstance;
  help: YargsInstance['addHelpOpt'];
  hide(key: string): YargsInstance;
  implies: {
    (key: string, implication: KeyOrPos | KeyOrPos[]): YargsInstance;
    (keyImplications: Dictionary<KeyOrPos | KeyOrPos[]>): YargsInstance;
  };
  locale: {
    (): string;
    (locale: string): YargsInstance;
  };
  middleware(
    callback: MiddlewareCallback | MiddlewareCallback[],
    applyBeforeValidation?: boolean
  ): YargsInstance;
  nargs: {
    (keys: string | string[], nargs: number): YargsInstance;
    (keyNargs: Dictionary<number>): YargsInstance;
  };
  normalize(keys: string | string[]): YargsInstance;
  number(keys: string | string[]): YargsInstance;
  onFinishCommand(f: FinishCommandHandler): YargsInstance;
  option: {
    (key: string, optionDefinition: OptionDefinition): YargsInstance;
    (keyOptionDefinitions: Dictionary<OptionDefinition>): YargsInstance;
  };
  options: YargsInstance['option'];
  parse: {
    (): Arguments | Promise<Arguments>;
    (args: string | string[]): Arguments | Promise<Arguments>;
    (args: string | string[], context: object, parseCallback?: ParseCallback):
      | Arguments
      | Promise<Arguments>;
    (args: string | string[], parseCallback: ParseCallback):
      | Arguments
      | Promise<Arguments>;
    (args: string | string[], shortCircuit: boolean):
      | Arguments
      | Promise<Arguments>;
  };
  parserConfiguration(config: Configuration): YargsInstance;
  pkgConf(key: string, rootPath?: string): YargsInstance;
  positional(
    key: string,
    positionalDefinition: PositionalDefinition
  ): YargsInstance;
  recommendCommands(recommend: boolean): YargsInstance;
  require: YargsInstance['demand'];
  required: YargsInstance['demand'];
  requiresArg(keys: string | string[] | Dictionary): YargsInstance;
  reset(aliases?: DetailedArguments['aliases']): YargsInstance;
  resetOptions(aliases?: DetailedArguments['aliases']): YargsInstance;
  scriptName(scriptName: string): YargsInstance;
  showCompletionScript($0?: string, cmd?: string): YargsInstance;
  showHelp(level: 'error' | 'log' | ((message: string) => void)): YargsInstance;
  showHelpOnFail: {
    (message?: string): YargsInstance;
    (enabled: boolean, message: string): YargsInstance;
  };
  showHidden: YargsInstance['addShowHiddenOpt'];
  skipValidation(keys: string | string[]): YargsInstance;
  strict(enable?: boolean): YargsInstance;
  strictCommands(enable?: boolean): YargsInstance;
  strictOptions(enable?: boolean): YargsInstance;
  string(key: string | string[]): YargsInstance;
  terminalWidth(): number | null;
  updateStrings(obj: Dictionary<string>): YargsInstance;
  updateLocale: YargsInstance['updateStrings'];
  usage: {
    (msg: string | null): YargsInstance;
    (
      msg: string,
      description: CommandHandler['description'],
      builder?: CommandBuilderDefinition | CommandBuilder,
      handler?: CommandHandlerCallback
    ): YargsInstance;
  };
  version: {
    (ver?: string | false): YargsInstance;
    (key?: string, ver?: string): YargsInstance;
    (key?: string, msg?: string, ver?: string): YargsInstance;
  };
  wrap(cols: number | null | undefined): YargsInstance;
}

export function isYargsInstance(y: YargsInstance | void): y is YargsInstance {
  return !!y && typeof y._parseArgs === 'function';
}

/** Yargs' context. */
export interface Context {
  commands: string[];
  files: string[];
  fullCommands: string[];
}

interface LoggerInstance {
  error: Function;
  log: Function;
}

export interface Options extends ParserOptions {
  __: (format: any, ...param: any[]) => string;
  alias: Dictionary<string[]>;
  array: string[];
  boolean: string[];
  choices: Dictionary<string[]>;
  config: Dictionary<ConfigCallback | boolean>;
  configObjects: Dictionary[];
  configuration: Configuration;
  count: string[];
  defaultDescription: Dictionary<string | undefined>;
  demandedCommands: Dictionary<{
    min: number;
    max: number;
    minMsg?: string | null;
    maxMsg?: string | null;
  }>;
  demandedOptions: Dictionary<string | undefined>;
  deprecatedOptions: Dictionary<string | boolean | undefined>;
  hiddenOptions: string[];
  /** Manually set keys */
  key: Dictionary<boolean | string>;
  local: string[];
  normalize: string[];
  number: string[];
  showHiddenOpt: string;
  skipValidation: string[];
  string: string[];
}

export interface Configuration extends Partial<ParserConfiguration> {
  /** Should a config object be deep-merged with the object config it extends? */
  'deep-merge-config'?: boolean;
  /** Should commands be sorted in help? */
  'sort-commands'?: boolean;
}

export interface OptionDefinition {
  alias?: string | string[];
  array?: boolean;
  boolean?: boolean;
  choices?: string | string[];
  coerce?: CoerceCallback;
  config?: boolean;
  configParser?: ConfigCallback;
  conflicts?: string | string[];
  count?: boolean;
  default?: any;
  defaultDescription?: string;
  deprecate?: string | boolean;
  deprecated?: OptionDefinition['deprecate'];
  desc?: string;
  describe?: OptionDefinition['desc'];
  description?: OptionDefinition['desc'];
  demand?: string | true;
  demandOption?: OptionDefinition['demand'];
  global?: boolean;
  group?: string;
  hidden?: boolean;
  implies?: string | number | KeyOrPos[];
  nargs?: number;
  normalize?: boolean;
  number?: boolean;
  require?: OptionDefinition['demand'];
  required?: OptionDefinition['demand'];
  requiresArg?: boolean;
  skipValidation?: boolean;
  string?: boolean;
  type?: 'array' | 'boolean' | 'count' | 'number' | 'string';
}

interface PositionalDefinition
  extends Pick<
    OptionDefinition,
    | 'alias'
    | 'array'
    | 'coerce'
    | 'choices'
    | 'conflicts'
    | 'default'
    | 'defaultDescription'
    | 'demand'
    | 'desc'
    | 'describe'
    | 'description'
    | 'implies'
    | 'normalize'
  > {
  type?: 'boolean' | 'number' | 'string';
}

interface FrozenYargsInstance {
  options: Options;
  configObjects: Dictionary[];
  exitProcess: boolean;
  groups: Dictionary<string[]>;
  strict: boolean;
  strictCommands: boolean;
  strictOptions: boolean;
  completionCommand: string | null;
  output: string;
  exitError: YError | string | undefined | null;
  hasOutput: boolean;
  parsed: DetailedArguments | false;
  parseFn: ParseCallback | null;
  parseContext: object | null;
  handlerFinishCommand: FinishCommandHandler | null;
}

interface ParseCallback {
  (
    err: YError | string | undefined | null,
    argv: Arguments | Promise<Arguments>,
    output: string
  ): void;
}

export interface Arguments {
  /** The script name or node command */
  $0: string;
  /** Non-option arguments */
  _: ArgsOutput;
  /** Arguments after the end-of-options flag `--` */
  '--'?: ArgsOutput;
  /** All remaining options */
  [argName: string]: any;
}

export interface DetailedArguments extends ParserDetailedArguments {
  argv: Arguments;
  aliases: Dictionary<string[]>;
}
