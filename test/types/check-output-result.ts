export interface CheckOutputResult<T> {
  errors: any[]
  logs: any[]
  warnings: any[]
  exit: boolean
  result: T
}
