#!/usr/bin/env node
/* eslint-disable no-undef */
/* eslint-disable node/shebang */
const argv = require('../../').help('help').version().parserConfiguration({
  'dot-notation': false,
  'boolean-negation': false,
}).parse();
console.log(argv);
