// TODO: either create @types/require-main-filename or or convert require-main-filename to typescript

/**
 * Returns the entry point of the current application.
 *
 * `require.main.filename` is great for figuring out the entry point for the current application.
 * This can be combined with a module like pkg-conf to, as if by magic, load top-level configuration.
 *
 * Unfortunately, `require.main.filename` sometimes fails when an application is executed
 * with an alternative process manager, e.g., iisnode.
 *
 * `require-main-filename` is a shim that addresses this problem.
 *
 * @param _require require function
 * @returns hash of modules in specified directory
 */
declare function requireMainFilename(_require: NodeRequire): string;

declare module 'require-main-filename' {
    export = requireMainFilename;
}
