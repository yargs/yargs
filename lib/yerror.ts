export class YError extends Error {
  name = 'YError';
  constructor(msg?: string | null) {
    super(msg || 'yargs error');
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, YError);
    }
  }
}