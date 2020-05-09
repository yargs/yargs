export class YError extends Error {
  name = 'YError'
  constructor (msg?: string | null) {
    super(msg || 'yargs error')
    Error.captureStackTrace(this, YError)
  }
}
