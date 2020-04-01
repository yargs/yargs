import { YError } from './yerror'
import { parseCommand } from './parse-command'
import { ParsedCommand } from './types'

const positionName = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth']
export function argsert (callerArguments: any[], length?: number): void
export function argsert (expected: string, callerArguments: any[], length?: number): void
export function argsert (arg1: string | any[], arg2?: any[] | number, arg3?: number): void {
  function parseArgs (): [Pick<ParsedCommand, 'demanded' | 'optional'>, any[], number?] {
    return typeof arg1 === 'object'
      ? [{ demanded: [], optional: [] }, arg1, arg2 as number | undefined]
      : [parseCommand(`cmd ${arg1}`), arg2 as any[], arg3 as number | undefined]
  }
  // TODO: should this eventually raise an exception.
  try {
    // preface the argument description with "cmd", so
    // that we can run it through yargs' command parser.
    let position = 0
    let [parsed, callerArguments, length] = parseArgs()
    const args = [].slice.call(callerArguments)

    while (args.length && args[args.length - 1] === undefined) args.pop()
    length = length || args.length

    if (length < parsed.demanded.length) {
      throw new YError(`Not enough arguments provided. Expected ${parsed.demanded.length} but received ${args.length}.`)
    }

    const totalCommands = parsed.demanded.length + parsed.optional.length
    if (length > totalCommands) {
      throw new YError(`Too many arguments provided. Expected max ${totalCommands} but received ${length}.`)
    }

    parsed.demanded.forEach((demanded) => {
      const arg = args.shift()
      const observedType = guessType(arg)
      const matchingTypes = demanded.cmd.filter(type => type === observedType || type === '*')
      if (matchingTypes.length === 0) argumentTypeError(observedType, demanded.cmd, position, false)
      position += 1
    })

    parsed.optional.forEach((optional) => {
      if (args.length === 0) return
      const arg = args.shift()
      const observedType = guessType(arg)
      const matchingTypes = optional.cmd.filter(type => type === observedType || type === '*')
      if (matchingTypes.length === 0) argumentTypeError(observedType, optional.cmd, position, true)
      position += 1
    })
  } catch (err) {
    console.warn(err.stack)
  }
}

function guessType (arg: any) {
  if (Array.isArray(arg)) {
    return 'array'
  } else if (arg === null) {
    return 'null'
  }
  return typeof arg
}

function argumentTypeError (observedType: string, allowedTypes: string[], position: number, optional: any) {
  throw new YError(`Invalid ${positionName[position] || 'manyith'} argument. Expected ${allowedTypes.join(' or ')} but received ${observedType}.`)
}
