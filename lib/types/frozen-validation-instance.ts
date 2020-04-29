import { CustomCheck } from './custom-check'
import { Dictionary } from './dictionary'
import { KeyOrPos } from './key-or-pos'

export interface FrozenValidationInstance {
  implied: Dictionary<KeyOrPos[]>
  checks: CustomCheck[]
  conflicting: Dictionary<(string | undefined)[]>
}
