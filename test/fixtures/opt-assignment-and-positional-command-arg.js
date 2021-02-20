#!/usr/bin/env node
/* eslint-disable node/shebang */
/* eslint-disable no-undef */
require('../../')
  .option('foo', {
    nargs: 1,
  })
  .command(
    'bar <baz>',
    'example',
    yargs => {
      return yargs;
    },
    argv => {
      console.log(JSON.stringify({_: argv._, foo: argv.foo, baz: argv.baz}));
    }
  )
  .parse();
