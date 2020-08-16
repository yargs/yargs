/* global Deno */

import {
  assertMatch
} from 'https://deno.land/std/testing/asserts.ts'
import { Yargs, YargsType, Arguments } from '../../deno.ts'

Deno.test('demandCommand(1) throw error if no command provided', () => {
  let err: Error|null = null
  Yargs()
    .usage('$0')
    .command('download [files...]', 'download a set of files', (yargs: YargsType) => {
      return yargs.positional('files', {
        describe: 'a list of files to do something with'
      })
    }, (argv: Arguments) => {
      console.info(argv)
    })
    .strictCommands()
    .demandCommand(1)
    .parse(Deno.args, (_err: Error) => {
      err = _err
    })
  assertMatch(err!.message, /Not enough non-option/)
})
