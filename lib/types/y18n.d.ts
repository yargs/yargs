// TODO: either update @types/y18n with this or convert y18n to typescript
// Forked from: https://github.com/DefinitelyTyped/DefinitelyTyped/blob/a9cb5fa/types/y18n/index.d.ts

interface Config {
  /**
   * The locale directory, default ./locales.
   */
  directory: string;
  /**
   * Should newly observed strings be updated in file, default true.
   */
  updateFiles: boolean;
  /**
   * What locale should be used.
   */
  locale: string;
  /**
   * Should fallback to a language-only file (e.g. en.json) be allowed
   * if a file matching the locale does not exist (e.g. en_US.json), default true.
   */
  fallbackToLanguage: boolean;
}

declare class Y18N {
  /**
   * Create an instance of y18n with the config provided
   */
  constructor(config?: Config);

  /**
   * Print a localized string, %s will be replaced with args.
   */
  __(str: string, arg1?: string, arg2?: string, arg3?: string): string;

  /**
   * Print a localized string with appropriate pluralization.
   * If %d is provided in the string, the quantity will replace this placeholder.
   */
  __n(singular: string, plural: string, quantity: number, ...param: any[]): string;

  /**
   * Set the current locale being used.
   */
  setLocale(str: string): void;

  /**
   * What locale is currently being used?
   */
  getLocale(): string;

  /**
   * Update the current locale with the key value pairs in obj.
   */
  updateLocale(obj: object): void;
}

declare module 'y18n' {
  export = Y18N;
}
