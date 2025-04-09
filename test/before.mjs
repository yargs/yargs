'use strict';
process.env.LC_ALL = 'en_US';
// See: https://github.com/yargs/yargs/issues/1666
console.warn = message => {
  throw Error(message);
};
