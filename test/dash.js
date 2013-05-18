var optimist = require('../index');
var test = require('tap').test;

test('-', function (t) {
    t.plan(3);
    t.deepEqual(
        fix(optimist.parse([ '-n', '-' ])),
        { n: '-', _: [] }
    );
    t.deepEqual(
        fix(optimist.parse([ '-' ])),
        { _: [ '-' ] }
    );
    t.deepEqual(
        fix(optimist.parse([ '-f-' ])),
        { f: '-', _: [] }
    );
});

function fix (obj) {
    delete obj.$0;
    return obj;
}
