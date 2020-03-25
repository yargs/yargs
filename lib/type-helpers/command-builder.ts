import { CommandBuilder, FunctionCommandBuilder } from '../types'

export function isFunctionCommandBuilder (builder: CommandBuilder): builder is FunctionCommandBuilder {
  return typeof builder === 'function'
}
