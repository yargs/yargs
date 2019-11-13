#!/usr/bin/env node
(async function main () {
    var argv = await require('yargs').argv;
    
    if (argv.rif - 5 * argv.xup > 7.138) {
        console.log('Buy more riffiwobbles');
    } else {
        console.log('Sell the xupptumblers');
    }
}) ();
