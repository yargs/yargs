#!/usr/bin/env node
/* eslint-disable node/shebang */
/* eslint-disable no-undef */
'use strict';

// for some unknown reason, a test environment has decided to omit require.main
delete require.main;

const yargs = require('../../');
const parser = yargs(process.argv.slice(2), undefined, require);

console.log(
  parser.parserConfiguration({
    'dot-notation': false,
    'boolean-negation': false,
  }).parse()
);
