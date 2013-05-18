var optimist = require('../index');
var test = require('tap').test;

test('-', function (t) {
    t.plan(3);
    t.equal(optimist.parse([ '-n', '-' ]).n, '-');
    t.same(optimist.parse([ '-' ])._, [ '-' ]);
    t.same(optimist.parse([ '-f-' ]).f, [ '-' ]);
});
