import { Dictionary, PlatformShim } from './typings/common-types.js';
import { UsageInstance } from './usage.js';
import { YargsInstance, Arguments } from './yargs-factory.js';
import { DetailedArguments } from './typings/yargs-parser-types.js';
export declare function validation(yargs: YargsInstance, usage: UsageInstance, shim: PlatformShim): ValidationInstance;
export interface ValidationInstance {
    conflicting(argv: Arguments): void;
    conflicts(key: string | Dictionary<string | string[]>, value?: string | string[]): void;
    freeze(): void;
    getConflicting(): Dictionary<(string | undefined)[]>;
    getImplied(): Dictionary<KeyOrPos[]>;
    implications(argv: Arguments): void;
    implies(key: string | Dictionary<KeyOrPos | KeyOrPos[]>, value?: KeyOrPos | KeyOrPos[]): void;
    isValidAndSomeAliasIsNotNew(key: string, aliases: DetailedArguments['aliases']): boolean;
    limitedChoices(argv: Arguments): void;
    nonOptionCount(argv: Arguments): void;
    positionalCount(required: number, observed: number): void;
    recommendCommands(cmd: string, potentialCommands: string[]): void;
    requiredArguments(argv: Arguments, demandedOptions: Dictionary<string | undefined>): void;
    reset(localLookup: Dictionary): ValidationInstance;
    unfreeze(): void;
    unknownArguments(argv: Arguments, aliases: DetailedArguments['aliases'], positionalMap: Dictionary, isDefaultCommand: boolean, checkPositionals?: boolean): void;
    unknownCommands(argv: Arguments): boolean;
}
export declare type KeyOrPos = string | number;
