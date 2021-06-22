// Taken from yargs-parser@19.0.1
// TODO: update this file periodically.
import type {Dictionary, ValueOf} from './common-types.js';

type KeyOf<T> = {
  [K in keyof T]: string extends K ? never : number extends K ? never : K;
} extends {[_ in keyof T]: infer U}
  ? U
  : never;

export declare type ArgsInput = string | any[];
export declare type ArgsOutput = (string | number)[];
export interface Arguments {
  /** Non-option arguments */
  _: ArgsOutput;
  /** Arguments after the end-of-options flag `--` */
  '--'?: ArgsOutput;
  /** All remaining options */
  [argName: string]: any;
}
export interface DetailedArguments {
  /** An object representing the parsed value of `args` */
  argv: Arguments;
  /** Populated with an error object if an exception occurred during parsing. */
  error: Error | null;
  /** The inferred list of aliases built by combining lists in opts.alias. */
  aliases: Dictionary<string[]>;
  /** Any new aliases added via camel-case expansion. */
  newAliases: Dictionary<boolean>;
  /** Any new argument created by opts.default, no aliases included. */
  defaulted: Dictionary<boolean>;
  /** The configuration loaded from the yargs stanza in package.json. */
  configuration: Configuration;
}
export interface Configuration {
  /** Should variables prefixed with --no be treated as negations? Default is `true` */
  'boolean-negation': boolean;
  /** Should hyphenated arguments be expanded into camel-case aliases? Default is `true` */
  'camel-case-expansion': boolean;
  /** Should arrays be combined when provided by both command line arguments and a configuration file? Default is `false`  */
  'combine-arrays': boolean;
  /** Should keys that contain `.` be treated as objects? Default is `true` */
  'dot-notation': boolean;
  /** Should arguments be coerced into an array when duplicated? Default is `true` */
  'duplicate-arguments-array': boolean;
  /** Should array arguments be coerced into a single array when duplicated? Default is `true` */
  'flatten-duplicate-arrays': boolean;
  /** Should arrays consume more than one positional argument following their flag? Default is `true` */
  'greedy-arrays': boolean;
  /** Should parsing stop at the first text argument? This is similar to how e.g. ssh parses its command line. Default is `false` */
  'halt-at-non-option': boolean;
  /** Should nargs consume dash options as well as positional arguments? Default is `false` */
  'nargs-eats-options': boolean;
  /** The prefix to use for negated boolean variables. Default is `'no-'` */
  'negation-prefix': string;
  /** Should positional values that look like numbers be parsed? Default is `true` */
  'parse-positional-numbers': boolean;
  /** Should keys that look like numbers be treated as such? Default is `true` */
  'parse-numbers': boolean;
  /** Should unparsed flags be stored in -- or _? Default is `false` */
  'populate--': boolean;
  /** Should a placeholder be added for keys not set via the corresponding CLI argument? Default is `false` */
  'set-placeholder-key': boolean;
  /** Should a group of short-options be treated as boolean flags? Default is `true` */
  'short-option-groups': boolean;
  /** Should aliases be removed before returning results? Default is `false` */
  'strip-aliased': boolean;
  /** Should dashed keys be removed before returning results? This option has no effect if camel-case-expansion is disabled. Default is `false` */
  'strip-dashed': boolean;
  /** Should unknown options be treated like regular arguments? An unknown option is one that is not configured in opts. Default is `false` */
  'unknown-options-as-args': boolean;
}
export declare type ArrayOption =
  | string
  | {
      key: string;
      boolean?: boolean;
      string?: boolean;
      number?: boolean;
      integer?: boolean;
    };
export declare type CoerceCallback = (arg: any) => any;
export declare type ConfigCallback = (configPath: string) =>
  | {
      [key: string]: any;
    }
  | Error;
export interface Options {
  /** An object representing the set of aliases for a key: `{ alias: { foo: ['f']} }`. */
  alias: Dictionary<string | string[]>;
  /**
   * Indicate that keys should be parsed as an array: `{ array: ['foo', 'bar'] }`.
   * Indicate that keys should be parsed as an array and coerced to booleans / numbers:
   * { array: [ { key: 'foo', boolean: true }, {key: 'bar', number: true} ] }`.
   */
  array: ArrayOption | ArrayOption[];
  /** Arguments should be parsed as booleans: `{ boolean: ['x', 'y'] }`. */
  boolean: string | string[];
  /** Indicate a key that represents a path to a configuration file (this file will be loaded and parsed). */
  config: string | string[] | Dictionary<boolean | ConfigCallback>;
  /** configuration objects to parse, their properties will be set as arguments */
  configObjects: Dictionary<any>[];
  /** Provide configuration options to the yargs-parser. */
  configuration: Partial<Configuration>;
  /**
   * Provide a custom synchronous function that returns a coerced value from the argument provided (or throws an error), e.g.
   * `{ coerce: { foo: function (arg) { return modifiedArg } } }`.
   */
  coerce: Dictionary<CoerceCallback>;
  /** Indicate a key that should be used as a counter, e.g., `-vvv = {v: 3}`. */
  count: string | string[];
  /** Provide default values for keys: `{ default: { x: 33, y: 'hello world!' } }`. */
  default: Dictionary<any>;
  /** Environment variables (`process.env`) with the prefix provided should be parsed. */
  envPrefix?: string;
  /** Specify that a key requires n arguments: `{ narg: {x: 2} }`. */
  narg: Dictionary<number>;
  /** `path.normalize()` will be applied to values set to this key. */
  normalize: string | string[];
  /** Keys should be treated as strings (even if they resemble a number `-x 33`). */
  string: string | string[];
  /** Keys should be treated as numbers. */
  number: string | string[];
  /** i18n handler, defaults to util.format */
  __: (format: any, ...param: any[]) => string;
  /** alias lookup table defaults */
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
export declare type OptionsDefault = ValueOf<
  Pick<Required<Options>, 'default'>
>;
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
export declare type ConfigsFlag = Dictionary<
  string | string[] | boolean | ConfigCallback
>;
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
export declare type ArrayFlagsKey = Extract<
  FlagsKey,
  'bools' | 'strings' | 'numbers'
>;
export interface DefaultValuesForType {
  boolean: boolean;
  string: string;
  number: undefined;
  array: any[];
}
export declare type DefaultValuesForTypeKey = KeyOf<DefaultValuesForType>;
