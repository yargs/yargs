optimist
========

Optimist is a node.js library for option parsing for people who hate option
parsing. More specifically, this module is for people who like all the --bells
and -whistlz of program usage but think optstrings are a waste of time.

With optimist, option parsing doesn't have to suck (as much).

With Optimist, the options are just a hash! No optstrings attached.
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
    
    $ ./xup.js --rif 12 --xup 8.1
    Sell the xupptumblers

But wait! There's more! You can do short options:
-------------------------------------------------
 
short.js:

    #!/usr/bin/env node
    var argv = require('optimist').argv;
    console.log('(%d,%d)', argv.x, argv.y);

***

    $ ./short.js -x 10 -y 21
    (10,21)

And booleans, both long and short (and grouped):
----------------------------------

bool.js:

    #!/usr/bin/env node
    var sys = require('sys');
    var argv = require('optimist').argv;

    if (argv.s) {
        sys.print(argv.fr ? 'Le chat dit: ' : 'The cat says: ');
    }
    console.log(
        (argv.fr ? 'miaou' : 'meow') + (argv.p ? '.' : '')
    );

***

    $ ./bool.js -s
    The cat says: meow
    
    $ ./bool.js -sp
    The cat says: meow.

    $ ./bool.js -sp --fr
    Le chat dit: miaou.

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
    Usage: node ./examples/divide.js -x [num] -y [num]

      -x  [required]

      -y  [required]

    Missing required arguments: y

EVEN MORE HOLY COW
------------------

default_singles.js:

    #!/usr/bin/env node
    var argv = require('optimist')
        .default('x', 10)
        .default('y', 10)
        .argv
    ;
    console.log(argv.x + argv.y);

***

    $ ./default_singles.js -x 5
    15

default_hash.js:

    #!/usr/bin/env node
    var argv = require('optimist')
        .default({ x : 10, y : 10 })
        .argv
    ;
    console.log(argv.x + argv.y);

***

    $ ./default_hash.js -y 7
    17

And if you really want to get all descriptive about it...
---------------------------------------------------------

boolean_single.js

    #!/usr/bin/env node
    var argv = require('optimist')
        .boolean('v')
        .argv
    ;
    console.dir(argv);

***

    $ ./boolean_single.js -v foo bar baz
    true
    [ 'bar', 'baz', 'foo' ]

boolean_double.js

    #!/usr/bin/env node
    var argv = require('optimist')
        .boolean(['x','y','z'])
        .argv
    ;
    console.dir([ argv.x, argv.y, argv.z ]);
    console.dir(argv._);

***

    $ ./boolean_double.js -x -z one two three
    [ true, false, true ]
    [ 'one', 'two', 'three' ]

Optimist is here to help...
---------------------------

You can describe parameters for help messages and set aliases. Optimist figures
out how to format a handy help string automatically.

line_count.js

    #!/usr/bin/env node
    var argv = require('optimist')
        .usage('Count the lines in a file.\nUsage: $0')
        .demand('f')
        .alias('f', 'file')
        .describe('f', 'Load a file')
        .argv
    ;

    var fs = require('fs');
    var s = fs.createReadStream(argv.file);

    var lines = 0;
    s.on('data', function (buf) {
        lines += buf.toString().match(/\n/g).length;
    });

    s.on('end', function () {
        console.log(lines);
    });

***

    $ node line_count.js
    Count the lines in a file.
    Usage: node ./line_count.js

    Options:
      -f, --file  Load a file  [required]

    Missing required arguments: f

    $ node line_count.js --file line_count.js 
    20
    
    $ node line_count.js -f line_count.js 
    20

notes
=====

Every argument that looks like a number (`!isNaN(Number(arg))`) is converted to
one. This way you can just `net.createConnection(argv.port)` and you can add
numbers out of `argv` with `+` without having that mean concatenation,
which is super frustrating.

installation
============

With [npm](http://github.com/isaacs/npm), just do:
    npm install optimist
 
or clone this project on github:

    git clone http://github.com/substack/node-optimist.git

To run the tests with [expresso](http://github.com/visionmedia/expresso),
just do:
    
    expresso

inspired By
===========

This module is loosely inspired by Perl's
[Getopt::Casual](http://search.cpan.org/~photo/Getopt-Casual-0.13.1/Casual.pm).
