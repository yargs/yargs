export interface CheckOutputResult<T> {
  errors: string[]
  logs: string[]
  warnings: string[]
  exit: boolean
  result: T
}
