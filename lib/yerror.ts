export class YError extends Error {
  name = 'YError'
  constructor (msg: string) {
    super(msg || 'yargs error')
    Error.captureStackTrace(this, YError)
  }
}
