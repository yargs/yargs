import type { Dictionary, ValueOf } from './common-types.js';
declare type KeyOf<T> = {
    [K in keyof T]: string extends K ? never : number extends K ? never : K;
} extends {
    [_ in keyof T]: infer U;
} ? U : never;
export declare type ArgsInput = string | any[];
export declare type ArgsOutput = (string | number)[];
export interface Arguments {
    _: ArgsOutput;
    '--'?: ArgsOutput;
    [argName: string]: any;
}
export interface DetailedArguments {
    argv: Arguments;
    error: Error | null;
    aliases: Dictionary<string[]>;
    newAliases: Dictionary<boolean>;
    defaulted: Dictionary<boolean>;
    configuration: Configuration;
}
export interface Configuration {
    'boolean-negation': boolean;
    'camel-case-expansion': boolean;
    'combine-arrays': boolean;
    'dot-notation': boolean;
    'duplicate-arguments-array': boolean;
    'flatten-duplicate-arrays': boolean;
    'greedy-arrays': boolean;
    'halt-at-non-option': boolean;
    'nargs-eats-options': boolean;
    'negation-prefix': string;
    'parse-positional-numbers': boolean;
    'parse-numbers': boolean;
    'populate--': boolean;
    'set-placeholder-key': boolean;
    'short-option-groups': boolean;
    'strip-aliased': boolean;
    'strip-dashed': boolean;
    'unknown-options-as-args': boolean;
}
export declare type ArrayOption = string | {
    key: string;
    boolean?: boolean;
    string?: boolean;
    number?: boolean;
    integer?: boolean;
};
export declare type CoerceCallback = (arg: any) => any;
export declare type ConfigCallback = (configPath: string) => {
    [key: string]: any;
} | Error;
export interface Options {
    alias: Dictionary<string | string[]>;
    array: ArrayOption | ArrayOption[];
    boolean: string | string[];
    config: string | string[] | Dictionary<boolean | ConfigCallback>;
    configObjects: Dictionary<any>[];
    configuration: Partial<Configuration>;
    coerce: Dictionary<CoerceCallback>;
    count: string | string[];
    default: Dictionary<any>;
    envPrefix?: string;
    narg: Dictionary<number>;
    normalize: string | string[];
    string: string | string[];
    number: string | string[];
    __: (format: any, ...param: any[]) => string;
    key: Dictionary<any>;
}
export interface PlatformShim {
    cwd: Function;
    format: Function;
    normalize: Function;
    require: Function;
    resolve: Function;
    env: Function;
}
export declare type OptionsDefault = ValueOf<Pick<Required<Options>, 'default'>>;
export interface Parser {
    (args: ArgsInput, opts?: Partial<Options>): Arguments;
    detailed(args: ArgsInput, opts?: Partial<Options>): DetailedArguments;
    camelCase(str: string): string;
    decamelize(str: string, joinString?: string): string;
    looksLikeNumber(x: null | undefined | number | string): boolean;
}
export declare type StringFlag = Dictionary<string[]>;
export declare type BooleanFlag = Dictionary<boolean>;
export declare type NumberFlag = Dictionary<number>;
export declare type ConfigsFlag = Dictionary<string | string[] | boolean | ConfigCallback>;
export declare type CoercionsFlag = Dictionary<CoerceCallback>;
export declare type KeysFlag = string[];
export interface Flags {
    aliases: StringFlag;
    arrays: BooleanFlag;
    bools: BooleanFlag;
    strings: BooleanFlag;
    numbers: BooleanFlag;
    counts: BooleanFlag;
    normalize: BooleanFlag;
    configs: ConfigsFlag;
    nargs: NumberFlag;
    coercions: CoercionsFlag;
    keys: KeysFlag;
}
export declare type Flag = ValueOf<Omit<Flags, 'keys'>>;
export declare type FlagValue = ValueOf<Flag>;
export declare type FlagsKey = KeyOf<Omit<Flags, 'keys'>>;
export declare type ArrayFlagsKey = Extract<FlagsKey, 'bools' | 'strings' | 'numbers'>;
export interface DefaultValuesForType {
    boolean: boolean;
    string: string;
    number: undefined;
    array: any[];
}
export declare type DefaultValuesForTypeKey = KeyOf<DefaultValuesForType>;
export {};
