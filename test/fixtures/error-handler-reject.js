#!/usr/bin/env node
require('../../index')
.command(
  '*',
  'example',
  function (yargs) { return yargs },
  function (argv) {
    return Promise.reject(new Error('test'))
  },
  function (error) {
    console.log('error catched : ' + error.message)
  }
)
.argv
