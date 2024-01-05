#!/usr/bin/env node
/* eslint-disable node/shebang */
/* eslint-disable no-undef */
const argv = require('./yargs-symlink')
  .help('help')
  .version()
  .parserConfiguration({
    'dot-notation': false,
    'boolean-negation': false,
  }).parse();
console.log(argv);
