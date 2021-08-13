import { Parser } from './yargs-parser-types.js';
export declare type Dictionary<T = any> = {
    [key: string]: T;
};
export declare type DictionaryKeyof<T, U = any> = Exclude<KeyOf<T, Dictionary<U>>, KeyOf<T, any[]>>;
export declare type KeyOf<T, U> = Exclude<{
    [K in keyof T]: T[K] extends U ? K : never;
}[keyof T], undefined>;
export declare type NotEmptyArray<T = any> = [T, ...T[]];
export declare type ValueOf<T> = T extends (infer U)[] ? U : T[keyof T];
export declare function assertNotStrictEqual<N, T>(actual: T | N, expected: N, shim: PlatformShim, message?: string | Error): asserts actual is Exclude<T, N>;
export declare function assertSingleKey(actual: string | string[] | Dictionary, shim: PlatformShim): asserts actual is string;
export declare function objectKeys<T>(object: T): (keyof T)[];
export interface RequireDirectoryOptions {
    extensions?: ReadonlyArray<string>;
    visit?: (commandObject: any, pathToFile: string, filename?: string) => any;
    recurse?: boolean;
}
export interface PlatformShim {
    assert: {
        notStrictEqual: (expected: any, observed: any, message?: string | Error) => void;
        strictEqual: (expected: any, observed: any, message?: string | Error) => void;
    };
    findUp: (startDir: string, fn: (dir: string[], names: string[]) => string | undefined) => string;
    getCallerFile: () => string;
    getEnv: (key: string) => string | undefined;
    getProcessArgvBin: () => string;
    inspect: (obj: object) => string;
    mainFilename: string;
    requireDirectory: Function;
    stringWidth: (str: string) => number;
    cliui: Function;
    Parser: Parser;
    path: {
        basename: (p1: string, p2?: string) => string;
        extname: (path: string) => string;
        dirname: (path: string) => string;
        relative: (p1: string, p2: string) => string;
        resolve: (p1: string, p2: string) => string;
    };
    process: {
        argv: () => string[];
        cwd: () => string;
        execPath: () => string;
        exit: (code: number) => void;
        nextTick: (cb: Function) => void;
        stdColumns: number | null;
    };
    readFileSync: (path: string, encoding: string) => string;
    require: RequireType;
    y18n: Y18N;
}
export interface RequireType {
    (path: string): Function;
    main: MainType;
}
export interface MainType {
    filename: string;
    children: MainType[];
}
export interface Y18N {
    __(str: string, ...args: string[]): string;
    __n(str: string, ...args: (string | number)[]): string;
    getLocale(): string;
    setLocale(locale: string): void;
    updateLocale(obj: {
        [key: string]: string;
    }): void;
}
