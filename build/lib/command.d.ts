import { Dictionary, RequireDirectoryOptions, PlatformShim } from './typings/common-types.js';
import { GlobalMiddleware, Middleware } from './middleware.js';
import { Positional } from './parse-command.js';
import { UsageInstance } from './usage.js';
import { ValidationInstance } from './validation.js';
import { YargsInstance, Options, OptionDefinition, Arguments, DetailedArguments } from './yargs-factory.js';
export declare type DefinitionOrCommandName = string | CommandHandlerDefinition;
export declare class CommandInstance {
    shim: PlatformShim;
    requireCache: Set<string>;
    handlers: Dictionary<CommandHandler>;
    aliasMap: Dictionary<string>;
    defaultCommand?: CommandHandler;
    usage: UsageInstance;
    globalMiddleware: GlobalMiddleware;
    validation: ValidationInstance;
    frozens: FrozenCommandInstance[];
    constructor(usage: UsageInstance, validation: ValidationInstance, globalMiddleware: GlobalMiddleware, shim: PlatformShim);
    addDirectory(dir: string, req: Function, callerFile: string, opts?: RequireDirectoryOptions): void;
    addHandler(cmd: string | CommandHandlerDefinition | DefinitionOrCommandName[], description?: CommandHandler['description'], builder?: CommandBuilderDefinition | CommandBuilder, handler?: CommandHandlerCallback, commandMiddleware?: Middleware[], deprecated?: boolean): void;
    getCommandHandlers(): Dictionary<CommandHandler>;
    getCommands(): string[];
    hasDefaultCommand(): boolean;
    runCommand(command: string | null, yargs: YargsInstance, parsed: DetailedArguments, commandIndex: number, helpOnly: boolean, helpOrVersionSet: boolean): Arguments | Promise<Arguments>;
    private applyBuilderUpdateUsageAndParse;
    private parseAndUpdateUsage;
    private shouldUpdateUsage;
    private usageFromParentCommandsCommandHandler;
    private applyMiddlewareAndGetResult;
    private populatePositionals;
    private populatePositional;
    cmdToParseOptions(cmdString: string): Positionals;
    private postProcessPositionals;
    runDefaultBuilderOn(yargs: YargsInstance): unknown | Promise<unknown>;
    private moduleName;
    private commandFromFilename;
    private extractDesc;
    freeze(): void;
    unfreeze(): void;
    reset(): CommandInstance;
}
export declare function command(usage: UsageInstance, validation: ValidationInstance, globalMiddleware: GlobalMiddleware, shim: PlatformShim): CommandInstance;
export interface CommandHandlerDefinition extends Partial<Pick<CommandHandler, 'deprecated' | 'description' | 'handler' | 'middlewares'>> {
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
export declare function isCommandBuilderDefinition(builder?: CommandBuilder | CommandBuilderDefinition): builder is CommandBuilderDefinition;
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
export declare type CommandBuilder = CommandBuilderCallback | Dictionary<OptionDefinition>;
interface CommandBuilderCallback {
    (y: YargsInstance, helpOrVersionSet: boolean): YargsInstance | void;
}
export declare function isCommandBuilderCallback(builder: CommandBuilder): builder is CommandBuilderCallback;
export declare function isCommandHandlerDefinition(cmd: DefinitionOrCommandName | [DefinitionOrCommandName, ...string[]]): cmd is CommandHandlerDefinition;
interface Positionals extends Pick<Options, 'alias' | 'array' | 'default'> {
    demand: Dictionary<boolean>;
}
declare type FrozenCommandInstance = {
    handlers: Dictionary<CommandHandler>;
    aliasMap: Dictionary<string>;
    defaultCommand: CommandHandler | undefined;
};
export {};
