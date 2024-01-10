#!/usr/bin/env node
var argv = require('yargs/yargs')(process.argv.slice(2)).parse();

if (argv.rif - 5 * argv.xup > 7.138) {
    console.log('Buy more riffiwobbles');
} else {
    console.log('Sell the xupptumblers');
}
