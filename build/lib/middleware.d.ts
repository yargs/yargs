import { YargsInstance, Arguments } from './yargs-factory.js';
export declare class GlobalMiddleware {
    globalMiddleware: Middleware[];
    yargs: YargsInstance;
    frozens: Array<Middleware[]>;
    constructor(yargs: YargsInstance);
    addMiddleware(callback: MiddlewareCallback | MiddlewareCallback[], applyBeforeValidation: boolean, global?: boolean): YargsInstance;
    addCoerceMiddleware(callback: MiddlewareCallback, option: string): YargsInstance;
    getMiddleware(): Middleware[];
    freeze(): void;
    unfreeze(): void;
    reset(): void;
}
export declare function commandMiddlewareFactory(commandMiddleware?: MiddlewareCallback[]): Middleware[];
export declare function applyMiddleware(argv: Arguments | Promise<Arguments>, yargs: YargsInstance, middlewares: Middleware[], beforeValidation: boolean): Arguments | Promise<Arguments>;
export interface MiddlewareCallback {
    (argv: Arguments, yargs: YargsInstance): Partial<Arguments> | Promise<Partial<Arguments>>;
}
export interface Middleware extends MiddlewareCallback {
    applyBeforeValidation: boolean;
    global: boolean;
    option?: string;
}
