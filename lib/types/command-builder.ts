import { YargsInstance } from './yargs-instance'

// To be completed later with other CommandBuilder flavours
export type CommandBuilder = FunctionCommandBuilder

export interface FunctionCommandBuilder {
  (y: YargsInstance): YargsInstance
}
