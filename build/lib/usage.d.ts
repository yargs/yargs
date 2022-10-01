import { Dictionary, PlatformShim, nil } from './typings/common-types.js';
import { YargsInstance } from './yargs-factory.js';
import { YError } from './yerror.js';
export declare function usage(yargs: YargsInstance, shim: PlatformShim): UsageInstance;
export interface UsageInstance {
    cacheHelpMessage(): void;
    clearCachedHelpMessage(): void;
    hasCachedHelpMessage(): boolean;
    command(cmd: string, description: string | undefined, isDefault: boolean, aliases: string[], deprecated?: boolean): void;
    deferY18nLookup(str: string): string;
    describe(keys: string | string[] | Dictionary<string>, desc?: string): void;
    epilog(msg: string): void;
    example(cmd: string, description?: string): void;
    fail(msg?: string | null, err?: YError | string): void;
    failFn(f: FailureFunction | boolean): void;
    freeze(): void;
    functionDescription(fn: {
        name?: string;
    }): string;
    getCommands(): [string, string, boolean, string[], boolean][];
    getDescriptions(): Dictionary<string | undefined>;
    getPositionalGroupName(): string;
    getUsage(): [string, string][];
    getUsageDisabled(): boolean;
    getWrap(): number | nil;
    help(): string;
    reset(localLookup: Dictionary<boolean>): UsageInstance;
    showHelp(level?: 'error' | 'log' | ((message: string) => void)): void;
    showHelpOnFail(enabled?: boolean | string, message?: string): UsageInstance;
    showVersion(level?: 'error' | 'log' | ((message: string) => void)): void;
    stringifiedValues(values?: any[], separator?: string): string;
    unfreeze(defaultCommand?: boolean): void;
    usage(msg: string | null, description?: string | false): UsageInstance;
    version(ver: any): void;
    wrap(cols: number | nil): void;
}
export interface FailureFunction {
    (msg: string | nil, err: YError | string | undefined, usage: UsageInstance): void;
}
export interface FrozenUsageInstance {
    failMessage: string | nil;
    failureOutput: boolean;
    usages: [string, string][];
    usageDisabled: boolean;
    epilogs: string[];
    examples: [string, string][];
    commands: [string, string, boolean, string[], boolean][];
    descriptions: Dictionary<string | undefined>;
}
