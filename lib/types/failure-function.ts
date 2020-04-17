import { UsageInstance } from './usage-instance'
import { YError } from '../yerror'

export interface FailureFunction {
  (msg: string | undefined | null, err: YError | string | undefined, usage: UsageInstance): void
}
