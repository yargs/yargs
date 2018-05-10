#!/usr/bin/env node
require('../../index')
  .option('foo', {
    nargs: 1
  })
  .command(
    'bar <baz>',
    'example',
    function (yargs) { return yargs },
    function (argv) {
      console.log(JSON.stringify({ _: argv._, foo: argv.foo, baz: argv.baz }))
    }
  )
  .parse()
