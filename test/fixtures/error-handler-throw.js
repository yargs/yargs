#!/usr/bin/env node
require('../../index')
.command(
  '*',
  'example',
  function (yargs) { return yargs },
  function (argv) {
    throw new Error('test')
  },
  function (error) {
    console.log('error catched : ' + error.message)
  }
)
.argv
