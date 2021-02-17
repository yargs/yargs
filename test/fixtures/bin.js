#!/usr/bin/env node
/* eslint-disable node/shebang */
// eslint-disable-next-line no-undef
const argv = require('../../').help('help').completion().argv;
console.log(JSON.stringify(argv._));
