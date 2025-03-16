#!/usr/bin/env node
/* eslint-disable node/shebang */
/* eslint-disable no-undef */
const yargs = require('../../');
const {hideBin} = require('../../helpers/helpers.mjs')

const argv = yargs(hideBin(process.argv))
  .help('help')
  .version()
  .parserConfiguration({
    'dot-notation': false,
    'boolean-negation': false,
  }).parse();
console.log(argv);
