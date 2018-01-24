#!/usr/bin/env node
require('yargs')
  .commandDir('cmds')
  .demandCommand()
  .help()
  .argv
