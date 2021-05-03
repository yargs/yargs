import { CommandInstance } from './command.js';
import { PlatformShim } from './typings/common-types.js';
import { UsageInstance } from './usage.js';
import { YargsInstance } from './yargs-factory.js';
import { Arguments, DetailedArguments } from './typings/yargs-parser-types.js';
declare type CompletionCallback = (err: Error | null, completions: string[] | undefined) => void;
export interface CompletionInstance {
    completionKey: string;
    generateCompletionScript($0: string, cmd: string): string;
    getCompletion(args: string[], done: (err: Error | null, completions: string[] | undefined) => void): any;
    registerFunction(fn: CompletionFunction): void;
    setParsed(parsed: DetailedArguments): void;
}
export declare class Completion implements CompletionInstance {
    private readonly yargs;
    private readonly usage;
    private readonly command;
    private readonly shim;
    completionKey: string;
    private aliases;
    private customCompletionFunction;
    private readonly zshShell;
    constructor(yargs: YargsInstance, usage: UsageInstance, command: CommandInstance, shim: PlatformShim);
    private defaultCompletion;
    private commandCompletions;
    private optionCompletions;
    private argsContainKey;
    private completeOptionKey;
    private customCompletion;
    getCompletion(args: string[], done: CompletionCallback): any;
    generateCompletionScript($0: string, cmd: string): string;
    registerFunction(fn: CompletionFunction): void;
    setParsed(parsed: DetailedArguments): void;
}
export declare function completion(yargs: YargsInstance, usage: UsageInstance, command: CommandInstance, shim: PlatformShim): CompletionInstance;
export declare type CompletionFunction = SyncCompletionFunction | AsyncCompletionFunction | FallbackCompletionFunction;
interface SyncCompletionFunction {
    (current: string, argv: Arguments): string[] | Promise<string[]>;
}
interface AsyncCompletionFunction {
    (current: string, argv: Arguments, done: (completions: string[]) => any): any;
}
interface FallbackCompletionFunction {
    (current: string, argv: Arguments, completionFilter: (onCompleted?: CompletionCallback) => any, done: (completions: string[]) => any): any;
}
export {};
