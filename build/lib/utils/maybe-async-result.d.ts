export declare function maybeAsyncResult<T>(getResult: (() => T | Promise<T>) | T | Promise<T>, resultHandler: (result: T) => T | Promise<T>, errorHandler?: (err: Error) => T): T | Promise<T>;
