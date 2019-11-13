#!/usr/bin/env node
(async function main () {
    var argv = await require('yargs').argv;
    
    if (argv.s) {
        console.log(argv.fr ? 'Le chat dit: ' : 'The cat says: ');
    }
    console.log(
        (argv.fr ? 'miaou' : 'meow') + (argv.p ? '.' : '')
    );
}) ();
