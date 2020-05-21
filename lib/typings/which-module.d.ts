// TODO: create @types/which-module from this

/**
 * Return the module object, if any, that represents the given argument in the require.cache.
 *
 * @param exported anything that was previously require()d or imported as a module, submodule, or dependency
 * - which means exported is identical to the module.exports returned by this method.
 * If exported did not come from the exports of a module in require.cache, then this method returns null
 */
declare function whichModule(exported: any): NodeModule | null;

declare module 'which-module' {
  export = whichModule;
}
