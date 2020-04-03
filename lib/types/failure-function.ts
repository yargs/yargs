import { UsageInstance } from './usage-instance'
import { YError } from '../yerror'

export interface FailureFunction {
  (msg: string | undefined, err: YError |undefined, usage: UsageInstance): void
}
