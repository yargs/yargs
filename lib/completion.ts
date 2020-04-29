import * as path from 'path'
import * as templates from './completion-templates'
import { isPromise } from './is-promise'
import { parseCommand } from './parse-command'
import {
  CommandInstance,
  CompletionFunction,
  CompletionInstance,
  UsageInstance,
  YargsInstance
} from './types'
import { isSyncCompletionFunction, isFunctionCommandBuilder } from './type-helpers'
import { DetailedArguments } from 'yargs-parser'

// add bash completions to your
//  yargs-powered applications.
export function completion (yargs: YargsInstance, usage: UsageInstance, command: CommandInstance) {
  const self: CompletionInstance = {
    completionKey: 'get-yargs-completions'
  } as CompletionInstance

  let aliases: DetailedArguments['aliases']
  self.setParsed = function setParsed (parsed) {
    aliases = parsed.aliases
  }

  const zshShell = (process.env.SHELL && process.env.SHELL.indexOf('zsh') !== -1) ||
    (process.env.ZSH_NAME && process.env.ZSH_NAME.indexOf('zsh') !== -1)
  // get a list of completion commands.
  // 'args' is the array of strings from the line to be completed
  self.getCompletion = function getCompletion (args, done) {
    const completions: string[] = []
    const current = args.length ? args[args.length - 1] : ''
    const argv = yargs.parse(args, true)
    const parentCommands = yargs.getContext().commands

    // a custom completion function can be provided
    // to completion().
    if (completionFunction) {
      if (isSyncCompletionFunction(completionFunction)) {
        const result = completionFunction(current, argv)

        // promise based completion function.
        if (isPromise(result)) {
          return result.then((list) => {
            process.nextTick(() => { done(list) })
          }).catch((err) => {
            process.nextTick(() => { throw err })
          })
        }

        // synchronous completion function.
        return done(result)
      } else {
        // asynchronous completion function
        return completionFunction(current, argv, (completions) => {
          done(completions)
        })
      }
    }

    const handlers = command.getCommandHandlers()
    for (let i = 0, ii = args.length; i < ii; ++i) {
      if (handlers[args[i]] && handlers[args[i]].builder) {
        const builder = handlers[args[i]].builder
        if (isFunctionCommandBuilder(builder)) {
          const y = yargs.reset()
          builder(y)
          return y.argv
        }
      }
    }

    if (!current.match(/^-/) && parentCommands[parentCommands.length - 1] !== current) {
      usage.getCommands().forEach((usageCommand) => {
        const commandName = parseCommand(usageCommand[0]).cmd
        if (args.indexOf(commandName) === -1) {
          if (!zshShell) {
            completions.push(commandName)
          } else {
            const desc = usageCommand[1] || ''
            completions.push(commandName.replace(/:/g, '\\:') + ':' + desc)
          }
        }
      })
    }

    if (current.match(/^-/) || (current === '' && completions.length === 0)) {
      const descs = usage.getDescriptions()
      const options = yargs.getOptions()
      Object.keys(options.key).forEach((key) => {
        const negable = !!options.configuration['boolean-negation'] && options.boolean.includes(key)
        // If the key and its aliases aren't in 'args', add the key to 'completions'
        let keyAndAliases = [key].concat(aliases[key] || [])
        if (negable) keyAndAliases = keyAndAliases.concat(keyAndAliases.map(key => `no-${key}`))

        function completeOptionKey (key: string) {
          const notInArgs = keyAndAliases.every(val => args.indexOf(`--${val}`) === -1)
          if (notInArgs) {
            const startsByTwoDashes = (s: string) => /^--/.test(s)
            const isShortOption = (s: string) => /^[^0-9]$/.test(s)
            const dashes = !startsByTwoDashes(current) && isShortOption(key) ? '-' : '--'
            if (!zshShell) {
              completions.push(dashes + key)
            } else {
              const desc = descs[key] || ''
              completions.push(dashes + `${key.replace(/:/g, '\\:')}:${desc.replace('__yargsString__:', '')}`)
            }
          }
        }

        completeOptionKey(key)
        if (negable && !!options.default[key]) completeOptionKey(`no-${key}`)
      })
    }

    done(completions)
  }

  // generate the completion script to add to your .bashrc.
  self.generateCompletionScript = function generateCompletionScript ($0, cmd) {
    let script = zshShell ? templates.completionZshTemplate : templates.completionShTemplate
    const name = path.basename($0)

    // add ./to applications not yet installed as bin.
    if ($0.match(/\.js$/)) $0 = `./${$0}`

    script = script.replace(/{{app_name}}/g, name)
    script = script.replace(/{{completion_command}}/g, cmd)
    return script.replace(/{{app_path}}/g, $0)
  }

  // register a function to perform your own custom
  // completions., this function can be either
  // synchrnous or asynchronous.
  let completionFunction: CompletionFunction | null = null
  self.registerFunction = (fn) => {
    completionFunction = fn
  }

  return self
}
