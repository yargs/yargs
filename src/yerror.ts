'use strict'
type YErrorCtor = {
  new (msg?: string): YError;
};
interface YError extends Error {}
const YError = function YError (this: YError, msg) {
  this.name = 'YError'
  this.message = msg || 'yargs error'
  Error.captureStackTrace(this, YError)
} as any as YErrorCtor;

YError.prototype = Object.create(Error.prototype)
YError.prototype.constructor = YError

export = YError;
