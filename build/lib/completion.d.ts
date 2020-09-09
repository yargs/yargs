import { CommandInstance } from './command.js';
import { PlatformShim } from './typings/common-types.js';
import { UsageInstance } from './usage.js';
import { YargsInstance } from './yargs-factory.js';
import { Arguments, DetailedArguments } from './typings/yargs-parser-types.js';
export declare function completion(yargs: YargsInstance, usage: UsageInstance, command: CommandInstance, shim: PlatformShim): CompletionInstance;
export interface CompletionInstance {
    completionKey: string;
    generateCompletionScript($0: string, cmd: string): string;
    getCompletion(args: string[], done: (completions: string[]) => any): any;
    registerFunction(fn: CompletionFunction): void;
    setParsed(parsed: DetailedArguments): void;
}
export declare type CompletionFunction = SyncCompletionFunction | AsyncCompletionFunction;
interface SyncCompletionFunction {
    (current: string, argv: Arguments): string[] | Promise<string[]>;
}
interface AsyncCompletionFunction {
    (current: string, argv: Arguments, done: (completions: string[]) => any): any;
}
export {};
