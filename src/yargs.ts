'use strict'
import argsert from './argsert'
import fs from 'fs'
import Command from './command'
import Completion from './completion'
import Parser from 'yargs-parser'
import path from 'path'
import Usage from './usage'
import Validation from './validation'
import Y18n from 'y18n'
import objFilter from './obj-filter'
import setBlocking from 'set-blocking'
import applyExtends from './apply-extends'
import middlewareFactory from './middleware'
import YError from './yerror'

export = Yargs
function Yargs (processArgs, cwd, parentRequire) {
  processArgs = processArgs || [] // handle calling yargs().

  const self = {
    $0: '',
    middleware: undefined as any as ReturnType<typeof middlewareFactory>,
    scriptName,
    getContext,
    resetOptions,
    reset: resetOptions,
    boolean,
    array,
    number,
    normalize,
    count,
    string,
    requiresArg,
    skipValidation,
    nargs,
    choices,
    alias,
    default: defaults,
    defaults,
    describe,
    demandOption,
    coerce,
    config,
    example,
    command: commandFn,
    commandDir,
    demand,
    required: demand,
    require: demand,
    demandCommand,
    getDemandedOptions,
    getDemandedCommands,
    implies,
    conflicts,
    usage: usageFn,
    epilogue,
    epilog: epilogue,
    fail,
    check,
    global,
    pkgConf,
    parse,
    _getParseContext,
    _hasParseCallback,
    option,
    options: option,
    getOptions,
    positional,
    group,
    getGroups,
    env,
    wrap,
    strict: strictFn,
    getStrict,
    showHelp,
    version,
    addHelpOpt,
    help: addHelpOpt,
    addShowHiddenOpt,
    showHidden: addShowHiddenOpt,
    hide,
    showHelpOnFail,
    exitProcess: exitProcessFn,
    getExitProcess,
    completion: completionFn,
    showCompletionScript,
    getCompletion,
    locale,
    updateStrings,
    updateLocale: updateStrings,
    detectLocale,
    getDetectLocale,
    exit,
    _getLoggerInstance,
    _hasOutput,
    _setHasOutput,
    recommendCommands,
    getUsageInstance,
    getValidationInstance,
    getCommandInstance,
    terminalWidth,
    _parseArgs,
    _runValidation,
    parsed: undefined as any as boolean
  }
  let command = null as any as ReturnType<typeof Command>
  let completion = null as any as ReturnType<typeof Completion>
  let groups = {}
  let globalMiddleware = []
  let output = ''
  let preservedGroups = {}
  let usage = null as any as ReturnType<typeof Usage>
  let validation = null as any as ReturnType<typeof Validation>

  const y18n = Y18n({
    directory: path.resolve(__dirname, './locales'),
    updateFiles: false
  })

  self.middleware = middlewareFactory(globalMiddleware, self)

  if (!cwd) cwd = process.cwd()

  function scriptName (scriptName) {
    self.$0 = scriptName
    return self
  }

  // ignore the node bin, specify this in your
  // bin file with #!/usr/bin/env node
  let $0: Array<string>;
  if (/\b(node|iojs|electron)(\.exe)?$/.test(process.argv[0])) {
    $0 = process.argv.slice(1, 2)
  } else {
    $0 = process.argv.slice(0, 1)
  }

  self.$0 = $0
    .map((x, i) => {
      const b = rebase(cwd, x)
      return x.match(/^(\/|([a-zA-Z]:)?\\)/) && b.length < x.length ? b : x
    })
    .join(' ').trim()

  if (process.env._ !== undefined && process.argv[1] === process.env._) {
    self.$0 = process.env._.replace(
      `${path.dirname(process.execPath)}/`, ''
    )
  }

  // use context object to keep track of resets, subcommand execution, etc
  // submodules should modify and check the state of context as necessary
  const context = { resets: -1, commands: [], fullCommands: [], files: [] }
  function getContext () {return context}

  // puts yargs back into an initial state. any keys
  // that have been set to "global" will not be reset
  // by this action.
  let options
  function resetOptions (aliases?) {
    context.resets++
    aliases = aliases || {}
    options = options || {}
    // put yargs back into an initial state, this
    // logic is used to build a nested command
    // hierarchy.
    const tmpOptions = {
      local: options.local ? options.local : [],
      configObjects: options.configObjects ? options.configObjects : [],
      envPrefix: undefined as unknown
    }

    // if a key has been explicitly set as local,
    // we should reset it before passing options to command.
    const localLookup = {}
    tmpOptions.local.forEach((l) => {
      localLookup[l] = true
      ;(aliases[l] || []).forEach((a) => {
        localLookup[a] = true
      })
    })

    // preserve all groups not set to local.
    preservedGroups = Object.keys(groups).reduce((acc, groupName) => {
      const keys = groups[groupName].filter(key => !(key in localLookup))
      if (keys.length > 0) {
        acc[groupName] = keys
      }
      return acc
    }, {})
    // groups can now be reset
    groups = {}

    const arrayOptions = [
      'array', 'boolean', 'string', 'skipValidation',
      'count', 'normalize', 'number',
      'hiddenOptions'
    ]

    const objectOptions = [
      'narg', 'key', 'alias', 'default', 'defaultDescription',
      'config', 'choices', 'demandedOptions', 'demandedCommands', 'coerce'
    ]

    arrayOptions.forEach((k) => {
      tmpOptions[k] = (options[k] || []).filter(k => !localLookup[k])
    })

    objectOptions.forEach((k) => {
      tmpOptions[k] = objFilter(options[k], (k, v) => !localLookup[k])
    })

    tmpOptions.envPrefix = options.envPrefix
    options = tmpOptions

    // if this is the first time being executed, create
    // instances of all our helpers -- otherwise just reset.
    usage = usage ? usage.reset(localLookup) : Usage(self, y18n)
    validation = validation ? validation.reset(localLookup) : Validation(self, usage, y18n)
    command = command ? command.reset() : Command(self, usage, validation, globalMiddleware)
    if (!completion) completion = Completion(self, usage, command)

    completionCommand = null
    output = ''
    exitError = null
    hasOutput = false
    self.parsed = false

    return self
  }
  self.resetOptions()

  // temporary hack: allow "freezing" of reset-able state for parse(msg, cb)
  let frozen
  function freeze () {
    frozen = {}
    frozen.options = options
    frozen.configObjects = options.configObjects.slice(0)
    frozen.exitProcess = exitProcess
    frozen.groups = groups
    usage.freeze()
    validation.freeze()
    command.freeze()
    frozen.strict = strict
    frozen.completionCommand = completionCommand
    frozen.output = output
    frozen.exitError = exitError
    frozen.hasOutput = hasOutput
    frozen.parsed = self.parsed
  }
  function unfreeze () {
    options = frozen.options
    options.configObjects = frozen.configObjects
    exitProcess = frozen.exitProcess
    groups = frozen.groups
    output = frozen.output
    exitError = frozen.exitError
    hasOutput = frozen.hasOutput
    self.parsed = frozen.parsed
    usage.unfreeze()
    validation.unfreeze()
    command.unfreeze()
    strict = frozen.strict
    completionCommand = frozen.completionCommand
    parseFn = null
    parseContext = null
    frozen = undefined
  }

  function boolean (keys) {
    argsert('<array|string>', [keys], arguments.length)
    populateParserHintArray('boolean', keys)
    return self
  }

  function array (keys) {
    argsert('<array|string>', [keys], arguments.length)
    populateParserHintArray('array', keys)
    return self
  }

  function number (keys) {
    argsert('<array|string>', [keys], arguments.length)
    populateParserHintArray('number', keys)
    return self
  }

  function normalize (keys) {
    argsert('<array|string>', [keys], arguments.length)
    populateParserHintArray('normalize', keys)
    return self
  }

  function count (keys) {
    argsert('<array|string>', [keys], arguments.length)
    populateParserHintArray('count', keys)
    return self
  }

  function string (keys) {
    argsert('<array|string>', [keys], arguments.length)
    populateParserHintArray('string', keys)
    return self
  }

  function requiresArg (keys) {
    argsert('<array|string>', [keys], arguments.length)
    populateParserHintObject(self.nargs, false, 'narg', keys, 1)
    return self
  }

  function skipValidation (keys) {
    argsert('<array|string>', [keys], arguments.length)
    populateParserHintArray('skipValidation', keys)
    return self
  }

  function populateParserHintArray (type, keys, value?) {
    keys = [].concat(keys)
    keys.forEach((key) => {
      options[type].push(key)
    })
  }

  function nargs (key, value) {
    argsert('<string|object|array> [number]', [key, value], arguments.length)
    populateParserHintObject(self.nargs, false, 'narg', key, value)
    return self
  }

  function choices (key, value) {
    argsert('<object|string|array> [string|array]', [key, value], arguments.length)
    populateParserHintObject(self.choices, true, 'choices', key, value)
    return self
  }

  function alias (key, value) {
    argsert('<object|string|array> [string|array]', [key, value], arguments.length)
    populateParserHintObject(self.alias, true, 'alias', key, value)
    return self
  }

  // TODO: actually deprecate self.defaults.
  function defaults (key, value, defaultDescription) {
    argsert('<object|string|array> [*] [string]', [key, value, defaultDescription], arguments.length)
    if (defaultDescription) options.defaultDescription[key] = defaultDescription
    if (typeof value === 'function') {
      if (!options.defaultDescription[key]) options.defaultDescription[key] = usage.functionDescription(value)
      value = value.call()
    }
    populateParserHintObject(self.default, false, 'default', key, value)
    return self
  }

  function describe (key, desc) {
    argsert('<object|string|array> [string]', [key, desc], arguments.length)
    populateParserHintObject(self.describe, false, 'key', key, true)
    usage.describe(key, desc)
    return self
  }

  function demandOption (keys, msg?) {
    argsert('<object|string|array> [string]', [keys, msg], arguments.length)
    populateParserHintObject(self.demandOption, false, 'demandedOptions', keys, msg)
    return self
  }

  function coerce (keys, value) {
    argsert('<object|string|array> [function]', [keys, value], arguments.length)
    populateParserHintObject(self.coerce, false, 'coerce', keys, value)
    return self
  }

  function populateParserHintObject (builder, isArray, type, key, value) {
    if (Array.isArray(key)) {
      // an array of keys with one value ['x', 'y', 'z'], function parse () {}
      const temp = {}
      key.forEach((k) => {
        temp[k] = value
      })
      builder(temp)
    } else if (typeof key === 'object') {
      // an object of key value pairs: {'x': parse () {}, 'y': parse() {}}
      Object.keys(key).forEach((k) => {
        builder(k, key[k])
      })
    } else {
      // a single key value pair 'x', parse() {}
      if (isArray) {
        options[type][key] = (options[type][key] || []).concat(value)
      } else {
        options[type][key] = value
      }
    }
  }

  function deleteFromParserHintObject (optionKey) {
    // delete from all parsing hints:
    // boolean, array, key, alias, etc.
    Object.keys(options).forEach((hintKey) => {
      const hint = options[hintKey]
      if (Array.isArray(hint)) {
        if (~hint.indexOf(optionKey)) hint.splice(hint.indexOf(optionKey), 1)
      } else if (typeof hint === 'object') {
        delete hint[optionKey]
      }
    })
    // now delete the description from usage.js.
    delete usage.getDescriptions()[optionKey]
  }

  function config (key, msg, parseFn) {
    argsert('[object|string] [string|function] [function]', [key, msg, parseFn], arguments.length)
    // allow a config object to be provided directly.
    if (typeof key === 'object') {
      key = applyExtends(key, cwd)
      options.configObjects = (options.configObjects || []).concat(key)
      return self
    }

    // allow for a custom parsing function.
    if (typeof msg === 'function') {
      parseFn = msg
      msg = null
    }

    key = key || 'config'
    self.describe(key, msg || usage.deferY18nLookup('Path to JSON config file'))
    ;(Array.isArray(key) ? key : [key]).forEach((k) => {
      options.config[k] = parseFn || true
    })

    return self
  }

  function example (cmd, description) {
    argsert('<string> [string]', [cmd, description], arguments.length)
    usage.example(cmd, description)
    return self
  }

  function commandFn (cmd, description, builder, handler, middlewares?) {
    argsert('<string|array|object> [string|boolean] [function|object] [function] [array]', [cmd, description, builder, handler, middlewares], arguments.length)
    command.addHandler(cmd, description, builder, handler, middlewares)
    return self
  }

  function commandDir (dir, opts) {
    argsert('<string> [object]', [dir, opts], arguments.length)
    const req = parentRequire || require
    command.addDirectory(dir, self.getContext(), req, require('get-caller-file')(), opts)
    return self
  }

  // TODO: deprecate self.demand in favor of
  // .demandCommand() .demandOption().
  function demand (keys, max, msg) {
    // you can optionally provide a 'max' key,
    // which will raise an exception if too many '_'
    // options are provided.
    if (Array.isArray(max)) {
      max.forEach((key) => {
        self.demandOption(key, msg)
      })
      max = Infinity
    } else if (typeof max !== 'number') {
      msg = max
      max = Infinity
    }

    if (typeof keys === 'number') {
      self.demandCommand(keys, max, msg, msg)
    } else if (Array.isArray(keys)) {
      keys.forEach((key) => {
        self.demandOption(key, msg)
      })
    } else {
      if (typeof msg === 'string') {
        self.demandOption(keys, msg)
      } else if (msg === true || typeof msg === 'undefined') {
        self.demandOption(keys)
      }
    }

    return self
  }

  function demandCommand (min, max, minMsg, maxMsg) {
    argsert('[number] [number|string] [string|null|undefined] [string|null|undefined]', [min, max, minMsg, maxMsg], arguments.length)

    if (typeof min === 'undefined') min = 1

    if (typeof max !== 'number') {
      minMsg = max
      max = Infinity
    }

    self.global('_', false)

    options.demandedCommands._ = {
      min,
      max,
      minMsg,
      maxMsg
    }

    return self
  }

  function getDemandedOptions () {
    argsert([], 0)
    return options.demandedOptions
  }

  function getDemandedCommands () {
    argsert([], 0)
    return options.demandedCommands
  }

  function implies (key, value) {
    argsert('<string|object> [number|string|array]', [key, value], arguments.length)
    validation.implies(key, value)
    return self
  }

  function conflicts (key1, key2) {
    argsert('<string|object> [string|array]', [key1, key2], arguments.length)
    validation.conflicts(key1, key2)
    return self
  }

  function usageFn (msg, description, builder, handler) {
    argsert('<string|null|undefined> [string|boolean] [function|object] [function]', [msg, description, builder, handler], arguments.length)

    if (description !== undefined) {
      // .usage() can be used as an alias for defining
      // a default command.
      if ((msg || '').match(/^\$0( |$)/)) {
        return self.command(msg, description, builder, handler)
      } else {
        throw new YError('.usage() description must start with $0 if being used as alias for .command()')
      }
    } else {
      usage.usage(msg)
      return self
    }
  }

  function epilogue (msg) {
    argsert('<string>', [msg], arguments.length)
    usage.epilog(msg)
    return self
  }

  function fail (f) {
    argsert('<function>', [f], arguments.length)
    usage.failFn(f)
    return self
  }

  function check (f, _global) {
    argsert('<function> [boolean]', [f, _global], arguments.length)
    validation.check(f, _global !== false)
    return self
  }

  function global (globals, global) {
    argsert('<string|array> [boolean]', [globals, global], arguments.length)
    globals = [].concat(globals)
    if (global !== false) {
      options.local = options.local.filter(l => globals.indexOf(l) === -1)
    } else {
      globals.forEach((g) => {
        if (options.local.indexOf(g) === -1) options.local.push(g)
      })
    }
    return self
  }

  function pkgConf (key, rootPath) {
    argsert('<string> [string]', [key, rootPath], arguments.length)
    let conf = null
    // prefer cwd to require-main-filename in this method
    // since we're looking for e.g. "nyc" config in nyc consumer
    // rather than "yargs" config in nyc (where nyc is the main filename)
    const obj = pkgUp(rootPath || cwd)

    // If an object exists in the key, add it to options.configObjects
    if (obj[key] && typeof obj[key] === 'object') {
      conf = applyExtends(obj[key], rootPath || cwd)
      options.configObjects = (options.configObjects || []).concat(conf)
    }

    return self
  }

  const pkgs = {}
  function pkgUp (rootPath) {
    const npath = rootPath || '*'
    if (pkgs[npath]) return pkgs[npath]
    const findUp = require('find-up')

    let obj = {}
    try {
      let startDir = rootPath || require('require-main-filename')(parentRequire || require)

      // When called in an environment that lacks require.main.filename, such as a jest test runner,
      // startDir is already process.cwd(), and should not be shortened.
      // Whether or not it is _actually_ a directory (e.g., extensionless bin) is irrelevant, find-up handles it.
      if (!rootPath && path.extname(startDir)) {
        startDir = path.dirname(startDir)
      }

      const pkgJsonPath = findUp.sync('package.json', {
        cwd: startDir
      })
      obj = JSON.parse(fs.readFileSync(pkgJsonPath))
    } catch (noop) {}

    pkgs[npath] = obj || {}
    return pkgs[npath]
  }

  let parseFn = null
  let parseContext = null
  function parse (args, shortCircuit, _parseFn) {
    argsert('[string|array] [function|boolean|object] [function]', [args, shortCircuit, _parseFn], arguments.length)
    if (typeof args === 'undefined') {
      return self._parseArgs(processArgs)
    }

    // a context object can optionally be provided, this allows
    // additional information to be passed to a command handler.
    if (typeof shortCircuit === 'object') {
      parseContext = shortCircuit
      shortCircuit = _parseFn
    }

    // by providing a function as a second argument to
    // parse you can capture output that would otherwise
    // default to printing to stdout/stderr.
    if (typeof shortCircuit === 'function') {
      parseFn = shortCircuit
      shortCircuit = null
    }
    // completion short-circuits the parsing process,
    // skipping validation, etc.
    if (!shortCircuit) processArgs = args

    freeze()
    if (parseFn) exitProcess = false

    const parsed = self._parseArgs(args, shortCircuit)
    if (parseFn) parseFn(exitError, parsed, output)
    unfreeze()

    return parsed
  }

  function _getParseContext () {return parseContext || {}}

  function _hasParseCallback () {return !!parseFn}

  function option (key, opt) {
    argsert('<string|object> [object]', [key, opt], arguments.length)
    if (typeof key === 'object') {
      Object.keys(key).forEach((k) => {
        self.options(k, key[k])
      })
    } else {
      if (typeof opt !== 'object') {
        opt = {}
      }

      options.key[key] = true // track manually set keys.

      if (opt.alias) self.alias(key, opt.alias)

      const demand = opt.demand || opt.required || opt.require

      // deprecated, use 'demandOption' instead
      if (demand) {
        self.demand(key, demand)
      }

      if (opt.demandOption) {
        self.demandOption(key, typeof opt.demandOption === 'string' ? opt.demandOption : undefined)
      }

      if ('conflicts' in opt) {
        self.conflicts(key, opt.conflicts)
      }

      if ('default' in opt) {
        self.default(key, opt.default)
      }

      if ('implies' in opt) {
        self.implies(key, opt.implies)
      }

      if ('nargs' in opt) {
        self.nargs(key, opt.nargs)
      }

      if (opt.config) {
        self.config(key, opt.configParser)
      }

      if (opt.normalize) {
        self.normalize(key)
      }

      if ('choices' in opt) {
        self.choices(key, opt.choices)
      }

      if ('coerce' in opt) {
        self.coerce(key, opt.coerce)
      }

      if ('group' in opt) {
        self.group(key, opt.group)
      }

      if (opt.boolean || opt.type === 'boolean') {
        self.boolean(key)
        if (opt.alias) self.boolean(opt.alias)
      }

      if (opt.array || opt.type === 'array') {
        self.array(key)
        if (opt.alias) self.array(opt.alias)
      }

      if (opt.number || opt.type === 'number') {
        self.number(key)
        if (opt.alias) self.number(opt.alias)
      }

      if (opt.string || opt.type === 'string') {
        self.string(key)
        if (opt.alias) self.string(opt.alias)
      }

      if (opt.count || opt.type === 'count') {
        self.count(key)
      }

      if (typeof opt.global === 'boolean') {
        self.global(key, opt.global)
      }

      if (opt.defaultDescription) {
        options.defaultDescription[key] = opt.defaultDescription
      }

      if (opt.skipValidation) {
        self.skipValidation(key)
      }

      const desc = opt.describe || opt.description || opt.desc
      self.describe(key, desc)
      if (opt.hidden) {
        self.hide(key)
      }

      if (opt.requiresArg) {
        self.requiresArg(key)
      }
    }

    return self
  }
  function getOptions () {return options}

  function positional (key, opts) {
    argsert('<string> <object>', [key, opts], arguments.length)
    if (context.resets === 0) {
      throw new YError(".positional() can only be called in a command's builder function")
    }

    // .positional() only supports a subset of the configuration
    // options availble to .option().
    const supportedOpts = ['default', 'implies', 'normalize',
      'choices', 'conflicts', 'coerce', 'type', 'describe',
      'desc', 'description', 'alias']
    opts = objFilter(opts, (k, v) => {
      let accept = supportedOpts.indexOf(k) !== -1
      // type can be one of string|number|boolean.
      if (k === 'type' && ['string', 'number', 'boolean'].indexOf(v) === -1) accept = false
      return accept
    })

    // copy over any settings that can be inferred from the command string.
    const fullCommand = context.fullCommands[context.fullCommands.length - 1]
    const parseOptions = fullCommand ? command.cmdToParseOptions(fullCommand) : {
      array: [],
      alias: {},
      default: {},
      demand: {}
    }
    Object.keys(parseOptions).forEach((pk) => {
      if (Array.isArray(parseOptions[pk])) {
        if (parseOptions[pk].indexOf(key) !== -1) opts[pk] = true
      } else {
        if (parseOptions[pk][key] && !(pk in opts)) opts[pk] = parseOptions[pk][key]
      }
    })
    self.group(key, usage.getPositionalGroupName())
    return self.option(key, opts)
  }

  function group (opts, groupName) {
    argsert('<string|array> <string>', [opts, groupName], arguments.length)
    const existing = preservedGroups[groupName] || groups[groupName]
    if (preservedGroups[groupName]) {
      // we now only need to track this group name in groups.
      delete preservedGroups[groupName]
    }

    const seen = {}
    groups[groupName] = (existing || []).concat(opts).filter((key) => {
      if (seen[key]) return false
      return (seen[key] = true)
    })
    return self
  }
  // combine explicit and preserved groups. explicit groups should be first
  function getGroups () {return Object.assign({}, groups, preservedGroups)}

  // as long as options.envPrefix is not undefined,
  // parser will apply env vars matching prefix to argv
  function env (prefix) {
    argsert('[string|boolean]', [prefix], arguments.length)
    if (prefix === false) options.envPrefix = undefined
    else options.envPrefix = prefix || ''
    return self
  }

  function wrap (cols) {
    argsert('<number|null|undefined>', [cols], arguments.length)
    usage.wrap(cols)
    return self
  }

  let strict = false
  function strictFn (enabled) {
    argsert('[boolean]', [enabled], arguments.length)
    strict = enabled !== false
    return self
  }
  function getStrict () {return strict}

  function showHelp (level) {
    argsert('[string|function]', [level], arguments.length)
    if (!self.parsed) self._parseArgs(processArgs) // run parser, if it has not already been executed.
    if (command.hasDefaultCommand()) {
      context.resets++ // override the restriction on top-level positoinals.
      command.runDefaultBuilderOn(self, true)
    }
    usage.showHelp(level)
    return self
  }

  let versionOpt = null
  function version (opt, msg, ver) {
    const defaultVersionOpt = 'version'
    argsert('[boolean|string] [string] [string]', [opt, msg, ver], arguments.length)

    // nuke the key previously configured
    // to return version #.
    if (versionOpt) {
      deleteFromParserHintObject(versionOpt)
      usage.version(undefined)
      versionOpt = null
    }

    if (arguments.length === 0) {
      ver = guessVersion()
      opt = defaultVersionOpt
    } else if (arguments.length === 1) {
      if (opt === false) { // disable default 'version' key.
        return self
      }
      ver = opt
      opt = defaultVersionOpt
    } else if (arguments.length === 2) {
      ver = msg
      msg = null
    }

    versionOpt = typeof opt === 'string' ? opt : defaultVersionOpt
    msg = msg || usage.deferY18nLookup('Show version number')

    usage.version(ver || undefined)
    self.boolean(versionOpt)
    self.describe(versionOpt, msg)
    return self
  }

  function guessVersion () {
    const obj = pkgUp()

    return obj.version || 'unknown'
  }

  let helpOpt = null
  function addHelpOpt (opt, msg) {
    const defaultHelpOpt = 'help'
    argsert('[string|boolean] [string]', [opt, msg], arguments.length)

    // nuke the key previously configured
    // to return help.
    if (helpOpt) {
      deleteFromParserHintObject(helpOpt)
      helpOpt = null
    }

    if (arguments.length === 1) {
      if (opt === false) return self
    }

    // use arguments, fallback to defaults for opt and msg
    helpOpt = typeof opt === 'string' ? opt : defaultHelpOpt
    self.boolean(helpOpt)
    self.describe(helpOpt, msg || usage.deferY18nLookup('Show help'))
    return self
  }

  const defaultShowHiddenOpt = 'show-hidden'
  options.showHiddenOpt = defaultShowHiddenOpt
  function addShowHiddenOpt (opt, msg) {
    argsert('[string|boolean] [string]', [opt, msg], arguments.length)

    if (arguments.length === 1) {
      if (opt === false) return self
    }

    const showHiddenOpt = typeof opt === 'string' ? opt : defaultShowHiddenOpt
    self.boolean(showHiddenOpt)
    self.describe(showHiddenOpt, msg || usage.deferY18nLookup('Show hidden options'))
    options.showHiddenOpt = showHiddenOpt
    return self
  }

  function hide (key) {
    argsert('<string|object>', [key], arguments.length)
    options.hiddenOptions.push(key)
    return self
  }

  function showHelpOnFail (enabled, message) {
    argsert('[boolean|string] [string]', [enabled, message], arguments.length)
    usage.showHelpOnFail(enabled, message)
    return self
  }

  var exitProcess = true
  function exitProcessFn (enabled) {
    argsert('[boolean]', [enabled], arguments.length)
    if (typeof enabled !== 'boolean') {
      enabled = true
    }
    exitProcess = enabled
    return self
  }
  function getExitProcess () {return exitProcess}

  var completionCommand = null
  function completionFn (cmd, desc, fn) {
    argsert('[string] [string|boolean|function] [function]', [cmd, desc, fn], arguments.length)

    // a function to execute when generating
    // completions can be provided as the second
    // or third argument to completion.
    if (typeof desc === 'function') {
      fn = desc
      desc = null
    }

    // register the completion command.
    completionCommand = cmd || 'completion'
    if (!desc && desc !== false) {
      desc = 'generate bash completion script'
    }
    self.command(completionCommand, desc)

    // a function can be provided
    if (fn) completion.registerFunction(fn)

    return self
  }

  function showCompletionScript ($0) {
    argsert('[string]', [$0], arguments.length)
    $0 = $0 || self.$0
    _logger.log(completion.generateCompletionScript($0, completionCommand))
    return self
  }

  function getCompletion (args, done) {
    argsert('<array> <function>', [args, done], arguments.length)
    completion.getCompletion(args, done)
  }

  function locale (locale) {
    argsert('[string]', [locale], arguments.length)
    if (arguments.length === 0) {
      guessLocale()
      return y18n.getLocale()
    }
    detectLocale = false
    y18n.setLocale(locale)
    return self
  }

  function updateStrings (obj) {
    argsert('<object>', [obj], arguments.length)
    detectLocale = false
    y18n.updateLocale(obj)
    return self
  }

  let detectLocale = true
  function detectLocale (detect) {
    argsert('<boolean>', [detect], arguments.length)
    detectLocale = detect
    return self
  }
  function getDetectLocale () {return detectLocale}

  var hasOutput = false
  var exitError = null
  // maybe exit, always capture
  // context about why we wanted to exit.
  function exit (code, err?) {
    hasOutput = true
    exitError = err
    if (exitProcess) process.exit(code)
  }

  // we use a custom logger that buffers output,
  // so that we can print to non-CLIs, e.g., chat-bots.
  const _logger = {
    log () {
      const args = []
      for (let i = 0; i < arguments.length; i++) args.push(arguments[i])
      if (!self._hasParseCallback()) console.log.apply(console, args)
      hasOutput = true
      if (output.length) output += '\n'
      output += args.join(' ')
    },
    error () {
      const args = []
      for (let i = 0; i < arguments.length; i++) args.push(arguments[i])
      if (!self._hasParseCallback()) console.error.apply(console, args)
      hasOutput = true
      if (output.length) output += '\n'
      output += args.join(' ')
    }
  }
  function _getLoggerInstance () {return _logger}
  // has yargs output an error our help
  // message in the current execution context.
  function _hasOutput () {return hasOutput}

  function _setHasOutput () {
    hasOutput = true
  }

  let recommendCommands
  function recommendCommands (recommend) {
    argsert('[boolean]', [recommend], arguments.length)
    recommendCommands = typeof recommend === 'boolean' ? recommend : true
    return self
  }

  function getUsageInstance () {return usage}

  function getValidationInstance () {return validation}

  function getCommandInstance () {return command}

  function terminalWidth () {
    argsert([], 0)
    return typeof process.stdout.columns !== 'undefined' ? process.stdout.columns : null
  }

  Object.defineProperty(self, 'argv', {
    get: () => self._parseArgs(processArgs),
    enumerable: true
  })

  function _parseArgs (args, shortCircuit, _skipValidation, commandIndex) {
    let skipValidation = !!_skipValidation
    args = args || processArgs

    options.__ = y18n.__
    options.configuration = pkgUp()['yargs'] || {}

    const parsed = Parser.detailed(args, options)
    let argv = parsed.argv
    if (parseContext) argv = Object.assign({}, argv, parseContext)
    const aliases = parsed.aliases

    argv.$0 = self.$0
    self.parsed = parsed

    try {
      guessLocale() // guess locale lazily, so that it can be turned off in chain.

      // while building up the argv object, there
      // are two passes through the parser. If completion
      // is being performed short-circuit on the first pass.
      if (shortCircuit) {
        return argv
      }

      // if there's a handler associated with a
      // command defer processing to it.
      if (helpOpt) {
        // consider any multi-char helpOpt alias as a valid help command
        // unless all helpOpt aliases are single-char
        // note that parsed.aliases is a normalized bidirectional map :)
        const helpCmds = [helpOpt]
          .concat(aliases[helpOpt] || [])
          .filter(k => k.length > 1)
        // check if help should trigger and strip it from _.
        if (~helpCmds.indexOf(argv._[argv._.length - 1])) {
          argv._.pop()
          argv[helpOpt] = true
        }
      }

      const handlerKeys = command.getCommands()
      const requestCompletions = completion.completionKey in argv
      const skipRecommendation = argv[helpOpt] || requestCompletions
      const skipDefaultCommand = skipRecommendation && (handlerKeys.length > 1 || handlerKeys[0] !== '$0')

      if (argv._.length) {
        if (handlerKeys.length) {
          let firstUnknownCommand
          for (let i = (commandIndex || 0), cmd; argv._[i] !== undefined; i++) {
            cmd = String(argv._[i])
            if (~handlerKeys.indexOf(cmd) && cmd !== completionCommand) {
              // commands are executed using a recursive algorithm that executes
              // the deepest command first; we keep track of the position in the
              // argv._ array that is currently being executed.
              return command.runCommand(cmd, self, parsed, i + 1)
            } else if (!firstUnknownCommand && cmd !== completionCommand) {
              firstUnknownCommand = cmd
              break
            }
          }

          // run the default command, if defined
          if (command.hasDefaultCommand() && !skipDefaultCommand) {
            return command.runCommand(null, self, parsed)
          }

          // recommend a command if recommendCommands() has
          // been enabled, and no commands were found to execute
          if (recommendCommands && firstUnknownCommand && !skipRecommendation) {
            validation.recommendCommands(firstUnknownCommand, handlerKeys)
          }
        }

        // generate a completion script for adding to ~/.bashrc.
        if (completionCommand && ~argv._.indexOf(completionCommand) && !requestCompletions) {
          if (exitProcess) setBlocking(true)
          self.showCompletionScript()
          self.exit(0)
        }
      } else if (command.hasDefaultCommand() && !skipDefaultCommand) {
        return command.runCommand(null, self, parsed)
      }

      // we must run completions first, a user might
      // want to complete the --help or --version option.
      if (requestCompletions) {
        if (exitProcess) setBlocking(true)

        // we allow for asynchronous completions,
        // e.g., loading in a list of commands from an API.
        const completionArgs = args.slice(args.indexOf(`--${completion.completionKey}`) + 1)
        completion.getCompletion(completionArgs, (completions) => {
          ;(completions || []).forEach((completion) => {
            _logger.log(completion)
          })

          self.exit(0)
        })
        return argv
      }

      // Handle 'help' and 'version' options
      // if we haven't already output help!
      if (!hasOutput) {
        Object.keys(argv).forEach((key) => {
          if (key === helpOpt && argv[key]) {
            if (exitProcess) setBlocking(true)

            skipValidation = true
            self.showHelp('log')
            self.exit(0)
          } else if (key === versionOpt && argv[key]) {
            if (exitProcess) setBlocking(true)

            skipValidation = true
            usage.showVersion()
            self.exit(0)
          }
        })
      }

      // Check if any of the options to skip validation were provided
      if (!skipValidation && options.skipValidation.length > 0) {
        skipValidation = Object.keys(argv).some(key => options.skipValidation.indexOf(key) >= 0 && argv[key] === true)
      }

      // If the help or version options where used and exitProcess is false,
      // or if explicitly skipped, we won't run validations.
      if (!skipValidation) {
        if (parsed.error) throw new YError(parsed.error.message)

        // if we're executed via bash completion, don't
        // bother with validation.
        if (!requestCompletions) {
          self._runValidation(argv, aliases, {}, parsed.error)
        }
      }
    } catch (err) {
      if (err instanceof YError) usage.fail(err.message, err)
      else throw err
    }

    return argv
  }

  function _runValidation (argv, aliases, positionalMap, parseErrors) {
    if (parseErrors) throw new YError(parseErrors.message || parseErrors)
    validation.nonOptionCount(argv)
    validation.requiredArguments(argv)
    if (strict) validation.unknownArguments(argv, aliases, positionalMap)
    validation.customChecks(argv, aliases)
    validation.limitedChoices(argv)
    validation.implications(argv)
    validation.conflicting(argv)
  }

  function guessLocale () {
    if (!detectLocale) return

    try {
      const osLocale = require('os-locale')
      self.locale(osLocale.sync({ spawn: false }))
    } catch (err) {
      // if we explode looking up locale just noop
      // we'll keep using the default language 'en'.
    }
  }

  // an app should almost always have --version and --help,
  // if you *really* want to disable this use .help(false)/.version(false).
  self.help()
  self.version()

  return self
}

// rebase an absolute path to a relative one with respect to a base directory
// exported for tests
Yargs.rebase = rebase
function rebase (base, dir) {
  return path.relative(base, dir)
}
