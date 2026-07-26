import { NotEmptyArray } from './typings/common-types.js';
export declare function parseCommand(cmd: string): ParsedCommand;
export interface ParsedCommand {
    cmd: string;
    demanded: Positional[];
    optional: Positional[];
}
export interface Positional {
    cmd: NotEmptyArray<string>;
    variadic: boolean;
}
