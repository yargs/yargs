Optimist
========

Optimist is a node.js library for option parsing for people who hate option
parsing. More specifically, this module is for people who like all the --bells
and -whistlz of program usage but think optstrings are a waste of time.

But all hope is not lost, dear reader, because there is Optimist, proving that
option parsing doesn't have to suck, even though it usually does.

With Optimist, the options are just a hash! No optstrings required.
-------------------------------------------------------------------

bizzlewup.js:

    #!/usr/bin/env node
    var argv = require('optimist').argv;

    if (argv.fubblemip - 5 * argv.xuppox > 7.138) {
        console.log('Buy more riffiwobbles');
    }
    else {
        console.log('Sell the xupptumblers');
    }

***
    $ ./bizzlewup.js --fubblemip=55 --xuppox=9.52
    Buy more riffiwobbles


But wait! There's more! You can do short options:
-------------------------------------------------
 
short.js:

    #!/usr/bin/env node
    var argv = require('optimist').argv;
    console.log('(%d,%d)', argv.x, argv.y);

***

    $ ./short.js -x 10 -y 21
    (10,21)

And non-hypenated options too! Just use `argv._`!
-------------------------------------------------
 
nonopt.js:

    #!/usr/bin/env node
    var argv = require('optimist').argv;
    console.log('(%d,%d)', argv.x, argv.y);
    console.log(argv._);

***
    $ ./nonopt.js -x 6.82 -y 3.35 moo
    (6.82,3.35)
    [ 'moo' ]
    
    $ ./nonopt.js foo -x 0.54 bar -y 1.12 baz
    (0.54,1.12)
    [ 'foo', 'bar', 'baz' ]

Installation
============

    npm install optimist
 
or clone this project on github

    git clone http://github.com/substack/node-optimist.git

Inspired By
===========

This module is loosely inspired by Perl's
[Getopt::Casual](http://search.cpan.org/~photo/Getopt-Casual-0.13.1/Casual.pm).
