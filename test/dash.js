var optimist = require('../index');
var test = require('tap').test;

test('-', function (t) {
    t.plan(5);
    t.equal(optimist.parse([ '-n', '-' ]).n, '-');
    t.equal(optimist.parse([ '-n', '-' ])['-'], undefined);
    t.same(optimist.parse([ '-' ])._, [ '-' ]);
    t.equal(optimist.parse([ '-f-' ]).f, '-');
    t.equal(optimist.parse([ '-f-' ])['-'], undefined);
});
