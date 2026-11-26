#!/usr/bin/env node
import yargs from 'yargs';

const argv = yargs().parse();

if (argv.rif - 5 * argv.xup > 7.138) {
  console.log('Buy more riffiwobbles');
} else {
  console.log('Sell the xupptumblers');
}
