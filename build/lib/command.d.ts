import { Dictionary, RequireDirectoryOptions, PlatformShim } from './typings/common-types.js';
import { Middleware } from './middleware.js';
import { Positional } from './parse-command.js';
import { UsageInstance } from './usage.js';
import { ValidationInstance } from './validation.js';
import { YargsInstance, Options, OptionDefinition, Context, Arguments, DetailedArguments } from './yargs-factory.js';
export declare function command(yargs: YargsInstance, usage: UsageInstance, validation: ValidationInstance, globalMiddleware: Middleware[] | undefined, shim: PlatformShim): CommandInstance;
export interface CommandInstance {
    addDirectory(dir: string, context: Context, req: Function, callerFile: string, opts?: RequireDirectoryOptions): void;
    addHandler(cmd: string | string[] | CommandHandlerDefinition, description?: CommandHandler['description'], builder?: CommandBuilderDefinition | CommandBuilder, handler?: CommandHandlerCallback, commandMiddleware?: Middleware[], deprecated?: boolean): void;
    cmdToParseOptions(cmdString: string): Positionals;
    freeze(): void;
    getCommandHandlers(): Dictionary<CommandHandler>;
    getCommands(): string[];
    hasDefaultCommand(): boolean;
    reset(): CommandInstance;
    runCommand(command: string | null, yargs: YargsInstance, parsed: DetailedArguments, commandIndex?: number): Arguments | Promise<Arguments>;
    runDefaultBuilderOn(yargs: YargsInstance): void;
    unfreeze(): void;
}
export interface CommandHandlerDefinition extends Partial<Pick<CommandHandler, 'deprecated' | 'description' | 'handler' | 'middlewares'>> {
    aliases?: string[];
    builder?: CommandBuilder | CommandBuilderDefinition;
    command?: string | string[];
    desc?: CommandHandler['description'];
    describe?: CommandHandler['description'];
}
export declare function isCommandHandlerDefinition(cmd: string | string[] | CommandHandlerDefinition): cmd is CommandHandlerDefinition;
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
    (y: YargsInstance): YargsInstance | void;
}
export declare function isCommandBuilderCallback(builder: CommandBuilder): builder is CommandBuilderCallback;
interface Positionals extends Pick<Options, 'alias' | 'array' | 'default'> {
    demand: Dictionary<boolean>;
}
export interface FinishCommandHandler {
    (handlerResult: any): any;
}
export {};
