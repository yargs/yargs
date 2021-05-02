import { CommandInstance, CommandHandler, CommandBuilderDefinition, CommandBuilder, CommandHandlerCallback, CommandHandlerDefinition, DefinitionOrCommandName } from './command.js';
import type { Dictionary, KeyOf, DictionaryKeyof, ValueOf, RequireDirectoryOptions, PlatformShim, RequireType } from './typings/common-types.js';
import { ArgsOutput, DetailedArguments as ParserDetailedArguments, Configuration as ParserConfiguration, Options as ParserOptions, ConfigCallback, CoerceCallback } from './typings/yargs-parser-types.js';
import { YError } from './yerror.js';
import { UsageInstance, FailureFunction } from './usage.js';
import { CompletionFunction } from './completion.js';
import { ValidationInstance, KeyOrPos } from './validation.js';
import { MiddlewareCallback, Middleware } from './middleware.js';
export declare function YargsFactory(_shim: PlatformShim): (processArgs?: string | string[], cwd?: string, parentRequire?: RequireType | undefined) => YargsInstance;
declare const kCopyDoubleDash: unique symbol;
declare const kCreateLogger: unique symbol;
declare const kDeleteFromParserHintObject: unique symbol;
declare const kFreeze: unique symbol;
declare const kGetDollarZero: unique symbol;
declare const kGetParserConfiguration: unique symbol;
declare const kGuessLocale: unique symbol;
declare const kGuessVersion: unique symbol;
declare const kParsePositionalNumbers: unique symbol;
declare const kPkgUp: unique symbol;
declare const kPopulateParserHintArray: unique symbol;
declare const kPopulateParserHintSingleValueDictionary: unique symbol;
declare const kPopulateParserHintArrayDictionary: unique symbol;
declare const kPopulateParserHintDictionary: unique symbol;
declare const kSanitizeKey: unique symbol;
declare const kSetKey: unique symbol;
declare const kUnfreeze: unique symbol;
declare const kValidateAsync: unique symbol;
declare const kGetCommandInstance: unique symbol;
declare const kGetContext: unique symbol;
declare const kGetHasOutput: unique symbol;
declare const kGetLoggerInstance: unique symbol;
declare const kGetParseContext: unique symbol;
declare const kGetUsageInstance: unique symbol;
declare const kGetValidationInstance: unique symbol;
declare const kHasParseCallback: unique symbol;
declare const kPostProcess: unique symbol;
declare const kRebase: unique symbol;
declare const kReset: unique symbol;
declare const kRunYargsParserAndExecuteCommands: unique symbol;
declare const kRunValidation: unique symbol;
declare const kSetHasOutput: unique symbol;
export interface YargsInternalMethods {
    getCommandInstance(): CommandInstance;
    getContext(): Context;
    getHasOutput(): boolean;
    getLoggerInstance(): LoggerInstance;
    getParseContext(): Object;
    getParserConfiguration(): Configuration;
    getUsageInstance(): UsageInstance;
    getValidationInstance(): ValidationInstance;
    hasParseCallback(): boolean;
    postProcess<T extends Arguments | Promise<Arguments>>(argv: Arguments | Promise<Arguments>, populateDoubleDash: boolean, calledFromCommand: boolean, runGlobalMiddleware: boolean): any;
    reset(aliases?: Aliases): YargsInstance;
    runValidation(aliases: Dictionary<string[]>, positionalMap: Dictionary<string[]>, parseErrors: Error | null, isDefaultCommand?: boolean): (argv: Arguments) => void;
    runYargsParserAndExecuteCommands(args: string | string[] | null, shortCircuit?: boolean | null, calledFromCommand?: boolean, commandIndex?: number, helpOnly?: boolean): Arguments | Promise<Arguments>;
    setHasOutput(): void;
}
export declare class YargsInstance {
    #private;
    $0: string;
    argv?: Arguments;
    customScriptName: boolean;
    parsed: DetailedArguments | false;
    constructor(processArgs: string | string[] | undefined, cwd: string, parentRequire: RequireType | undefined, shim: PlatformShim);
    addHelpOpt(opt?: string | false, msg?: string): YargsInstance;
    help(opt?: string, msg?: string): YargsInstance;
    addShowHiddenOpt(opt?: string | false, msg?: string): YargsInstance;
    showHidden(opt?: string | false, msg?: string): YargsInstance;
    alias(key: string | string[] | Dictionary<string | string[]>, value?: string | string[]): YargsInstance;
    array(keys: string | string[]): YargsInstance;
    boolean(keys: string | string[]): YargsInstance;
    check(f: (argv: Arguments) => any, global?: boolean): YargsInstance;
    choices(key: string | string[] | Dictionary<string | string[]>, value?: string | string[]): YargsInstance;
    coerce(keys: string | string[] | Dictionary<CoerceCallback>, value?: CoerceCallback): YargsInstance;
    conflicts(key1: string | Dictionary<string | string[]>, key2?: string | string[]): YargsInstance;
    config(key?: string | string[] | Dictionary, msg?: string | ConfigCallback, parseFn?: ConfigCallback): YargsInstance;
    completion(cmd?: string, desc?: string | false | CompletionFunction, fn?: CompletionFunction): YargsInstance;
    command(cmd: string | CommandHandlerDefinition | DefinitionOrCommandName[], description?: CommandHandler['description'], builder?: CommandBuilderDefinition | CommandBuilder, handler?: CommandHandlerCallback, middlewares?: Middleware[], deprecated?: boolean): YargsInstance;
    commands(cmd: string | CommandHandlerDefinition | DefinitionOrCommandName[], description?: CommandHandler['description'], builder?: CommandBuilderDefinition | CommandBuilder, handler?: CommandHandlerCallback, middlewares?: Middleware[], deprecated?: boolean): YargsInstance;
    commandDir(dir: string, opts?: RequireDirectoryOptions): YargsInstance;
    count(keys: string | string[]): YargsInstance;
    default(key: string | string[] | Dictionary<any>, value?: any, defaultDescription?: string): YargsInstance;
    defaults(key: string | string[] | Dictionary<any>, value?: any, defaultDescription?: string): YargsInstance;
    demandCommand(min?: number, max?: number | string, minMsg?: string | null, maxMsg?: string | null): YargsInstance;
    demand(keys: string | string[] | Dictionary<string | undefined> | number, max?: number | string[] | string | true, msg?: string | true): YargsInstance;
    demandOption(keys: string | string[] | Dictionary<string | undefined>, msg?: string): YargsInstance;
    deprecateOption(option: string, message: string | boolean): YargsInstance;
    describe(keys: string | string[] | Dictionary<string>, description?: string): YargsInstance;
    detectLocale(detect: boolean): YargsInstance;
    env(prefix?: string | false): YargsInstance;
    epilogue(msg: string): YargsInstance;
    epilog(msg: string): YargsInstance;
    example(cmd: string | [string, string?][], description?: string): YargsInstance;
    exit(code: number, err?: YError | string): void;
    exitProcess(enabled?: boolean): YargsInstance;
    fail(f: FailureFunction | boolean): YargsInstance;
    getAliases(): Dictionary<string[]>;
    getCompletion(args: string[], done?: (err: Error | null, completions: string[] | undefined) => void): Promise<string[] | void>;
    getDemandedOptions(): Dictionary<string | undefined>;
    getDemandedCommands(): Dictionary<{
        min: number;
        max: number;
        minMsg?: string | null | undefined;
        maxMsg?: string | null | undefined;
    }>;
    getDeprecatedOptions(): Dictionary<string | boolean | undefined>;
    getDetectLocale(): boolean;
    getExitProcess(): boolean;
    getGroups(): Dictionary<string[]>;
    getHelp(): Promise<string>;
    getOptions(): Options;
    getStrict(): boolean;
    getStrictCommands(): boolean;
    getStrictOptions(): boolean;
    global(globals: string | string[], global?: boolean): YargsInstance;
    group(opts: string | string[], groupName: string): YargsInstance;
    hide(key: string): YargsInstance;
    implies(key: string | Dictionary<KeyOrPos | KeyOrPos[]>, value?: KeyOrPos | KeyOrPos[]): YargsInstance;
    locale(locale?: string): YargsInstance | string;
    middleware(callback: MiddlewareCallback | MiddlewareCallback[], applyBeforeValidation?: boolean, global?: boolean): YargsInstance;
    nargs(key: string | string[] | Dictionary<number>, value?: number): YargsInstance;
    normalize(keys: string | string[]): YargsInstance;
    number(keys: string | string[]): YargsInstance;
    option(key: string | Dictionary<OptionDefinition>, opt?: OptionDefinition): YargsInstance;
    options(key: string | Dictionary<OptionDefinition>, opt?: OptionDefinition): YargsInstance;
    parse(args?: string | string[], shortCircuit?: object | ParseCallback | boolean, _parseFn?: ParseCallback): Arguments | Promise<Arguments>;
    parseAsync(args?: string | string[], shortCircuit?: object | ParseCallback | boolean, _parseFn?: ParseCallback): Promise<Arguments>;
    parseSync(args?: string | string[], shortCircuit?: object | ParseCallback | boolean, _parseFn?: ParseCallback): Arguments;
    parserConfiguration(config: Configuration): this;
    pkgConf(key: string, rootPath?: string): YargsInstance;
    positional(key: string, opts: PositionalDefinition): YargsInstance;
    recommendCommands(recommend?: boolean): YargsInstance;
    required(keys: string | string[] | Dictionary<string | undefined> | number, max?: number | string[] | string | true, msg?: string | true): YargsInstance;
    require(keys: string | string[] | Dictionary<string | undefined> | number, max?: number | string[] | string | true, msg?: string | true): YargsInstance;
    requiresArg(keys: string | string[] | Dictionary): YargsInstance;
    showCompletionScript($0?: string, cmd?: string): YargsInstance;
    showHelp(level: 'error' | 'log' | ((message: string) => void)): YargsInstance;
    scriptName(scriptName: string): YargsInstance;
    showHelpOnFail(enabled?: string | boolean, message?: string): YargsInstance;
    showVersion(level: 'error' | 'log' | ((message: string) => void)): YargsInstance;
    skipValidation(keys: string | string[]): YargsInstance;
    strict(enabled?: boolean): YargsInstance;
    strictCommands(enabled?: boolean): YargsInstance;
    strictOptions(enabled?: boolean): YargsInstance;
    string(key: string | string[]): YargsInstance;
    terminalWidth(): number | null;
    updateLocale(obj: Dictionary<string>): YargsInstance;
    updateStrings(obj: Dictionary<string>): YargsInstance;
    usage(msg: string | null, description?: CommandHandler['description'], builder?: CommandBuilderDefinition | CommandBuilder, handler?: CommandHandlerCallback): YargsInstance;
    version(opt?: string | false, msg?: string, ver?: string): YargsInstance;
    wrap(cols: number | null | undefined): YargsInstance;
    [kCopyDoubleDash](argv: Arguments): any;
    [kCreateLogger](): LoggerInstance;
    [kDeleteFromParserHintObject](optionKey: string): void;
    [kFreeze](): void;
    [kGetDollarZero](): string;
    [kGetParserConfiguration](): Configuration;
    [kGuessLocale](): void;
    [kGuessVersion](): string;
    [kParsePositionalNumbers](argv: Arguments): any;
    [kPkgUp](rootPath?: string): {
        [key: string]: string | {
            [key: string]: string;
        };
    };
    [kPopulateParserHintArray]<T extends KeyOf<Options, string[]>>(type: T, keys: string | string[]): void;
    [kPopulateParserHintSingleValueDictionary]<T extends Exclude<DictionaryKeyof<Options>, DictionaryKeyof<Options, any[]>> | 'default', K extends keyof Options[T] & string = keyof Options[T] & string, V extends ValueOf<Options[T]> = ValueOf<Options[T]>>(builder: (key: K, value: V, ...otherArgs: any[]) => YargsInstance, type: T, key: K | K[] | {
        [key in K]: V;
    }, value?: V): void;
    [kPopulateParserHintArrayDictionary]<T extends DictionaryKeyof<Options, any[]>, K extends keyof Options[T] & string = keyof Options[T] & string, V extends ValueOf<ValueOf<Options[T]>> | ValueOf<ValueOf<Options[T]>>[] = ValueOf<ValueOf<Options[T]>> | ValueOf<ValueOf<Options[T]>>[]>(builder: (key: K, value: V, ...otherArgs: any[]) => YargsInstance, type: T, key: K | K[] | {
        [key in K]: V;
    }, value?: V): void;
    [kPopulateParserHintDictionary]<T extends keyof Options, K extends keyof Options[T], V>(builder: (key: K, value: V, ...otherArgs: any[]) => YargsInstance, type: T, key: K | K[] | {
        [key in K]: V;
    }, value: V | undefined, singleKeyHandler: (type: T, key: K, value?: V) => void): void;
    [kSanitizeKey](key: any): any;
    [kSetKey](key: string | string[] | Dictionary<string | boolean>, set?: boolean | string): this;
    [kUnfreeze](): void;
    [kValidateAsync](validation: (argv: Arguments) => void, argv: Arguments | Promise<Arguments>): Arguments | Promise<Arguments>;
    getInternalMethods(): YargsInternalMethods;
    [kGetCommandInstance](): CommandInstance;
    [kGetContext](): Context;
    [kGetHasOutput](): boolean;
    [kGetLoggerInstance](): LoggerInstance;
    [kGetParseContext](): Object;
    [kGetUsageInstance](): UsageInstance;
    [kGetValidationInstance](): ValidationInstance;
    [kHasParseCallback](): boolean;
    [kPostProcess]<T extends Arguments | Promise<Arguments>>(argv: Arguments | Promise<Arguments>, populateDoubleDash: boolean, calledFromCommand: boolean, runGlobalMiddleware: boolean): any;
    [kReset](aliases?: Aliases): YargsInstance;
    [kRebase](base: string, dir: string): string;
    [kRunYargsParserAndExecuteCommands](args: string | string[] | null, shortCircuit?: boolean | null, calledFromCommand?: boolean, commandIndex?: number, helpOnly?: boolean): Arguments | Promise<Arguments>;
    [kRunValidation](aliases: Dictionary<string[]>, positionalMap: Dictionary<string[]>, parseErrors: Error | null, isDefaultCommand?: boolean): (argv: Arguments) => void;
    [kSetHasOutput](): void;
}
export declare function isYargsInstance(y: YargsInstance | void): y is YargsInstance;
export interface Context {
    commands: string[];
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
    key: Dictionary<boolean | string>;
    local: string[];
    normalize: string[];
    number: string[];
    showHiddenOpt: string;
    skipValidation: string[];
    string: string[];
}
export interface Configuration extends Partial<ParserConfiguration> {
    'deep-merge-config'?: boolean;
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
interface PositionalDefinition extends Pick<OptionDefinition, 'alias' | 'array' | 'coerce' | 'choices' | 'conflicts' | 'default' | 'defaultDescription' | 'demand' | 'desc' | 'describe' | 'description' | 'implies' | 'normalize'> {
    type?: 'boolean' | 'number' | 'string';
}
interface ParseCallback {
    (err: YError | string | undefined | null, argv: Arguments, output: string): void;
}
interface Aliases {
    [key: string]: Array<string>;
}
export interface Arguments {
    $0: string;
    _: ArgsOutput;
    '--'?: ArgsOutput;
    [argName: string]: any;
}
export interface DetailedArguments extends ParserDetailedArguments {
    argv: Arguments;
    aliases: Dictionary<string[]>;
}
export {};
