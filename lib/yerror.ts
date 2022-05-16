export class YError extends Error {
  name = 'YError';
  constructor(msg?: string | null) {
    super(msg || 'yargs error');
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, YError);
    }
  }
}
