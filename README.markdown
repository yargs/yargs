Optimist
========

Optimist is a node.js library for option parsing for people who hate option
parsing. More specifically, this module is for people who like all the --bells
and -whistlz of program usage but think optstrings are a waste of time.

But all hope is not lost, dear reader, because there is Optimist, proving that
option parsing doesn't have to suck (as much).

With Optimist, the options are just a hash! No optstrings required.
-------------------------------------------------------------------

xup.js:

    #!/usr/bin/env node
    var argv = require('optimist').argv;

    if (argv.rif - 5 * argv.xup > 7.138) {
        console.log('Buy more riffiwobbles');
    }
    else {
        console.log('Sell the xupptumblers');
    }

***

    $ ./xup.js --rif=55 --xup=9.52
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

And booleans, both long and short:
----------------------------------

bool.js:

    #!/usr/bin/env node
    var sys = require('sys');
    var argv = require('optimist').argv;

    if (argv.s) {
        sys.print(argv.fr
            ? 'Le chat dit: '
            : 'The cow says: '
        );
    }
    console.log(argv.fr ? 'miaou' : 'meow');

***
    $ ./bool.js -s
    The cat says: meow

    $ ./bool.js -s --fr
    Le chat dit: miaou


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

Plus, Optimist comes with .usage() and .demand()!
-------------------------------------------------

divide.js:
    #!/usr/bin/env node
    var argv = require('optimist')
        .usage('Usage: $0 -x [num] -y [num]')
        .demand(['x','y'])
        .argv;
    
    console.log(argv.x / argv.y);

***
 
    $ ./divide.js -x 55 -y 11
    5
    
    $ ./divide.js -x 4.91 -z 2.51
    Usage: ./divide.js -x [num] -y [num]
    Missing arguments: y

Installation
============

    npm install optimist
 
or clone this project on github

    git clone http://github.com/substack/node-optimist.git

Inspired By
===========

This module is loosely inspired by Perl's
[Getopt::Casual](http://search.cpan.org/~photo/Getopt-Casual-0.13.1/Casual.pm).
