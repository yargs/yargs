var optimist = require('../index');
var test = require('tap').test;

test('-', function (t) {
    t.plan(3);
    t.deepEqual(
        optimist.parse([ '-n', '-' ]),
        { $0: 'node', n: '-', _: [] }
    );
    t.deepEqual(
        optimist.parse([ '-' ]),
        { $0: 'node', _: [ '-' ] }
    );
    t.deepEqual(
        optimist.parse([ '-f-' ]),
        { $0: 'node', f: '-' }
    );
});
