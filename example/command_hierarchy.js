#!/usr/bin/env node
require('yargs/yargs')(process.argv.slice(2))
  .commandDir('cmds')
  .demandCommand()
  .help()
  .parse()
