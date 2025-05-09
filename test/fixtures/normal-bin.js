#!/usr/bin/env node
/* eslint-disable no-undef */
/* eslint-disable node/shebang */
const yargs = require('../../');
const {hideBin} = require('../../helpers/helpers.mjs')

const argv = yargs(hideBin(process.argv)).help('help').version().parserConfiguration({
  'dot-notation': false,
  'boolean-negation': false,
}).parse();
console.log(argv);
