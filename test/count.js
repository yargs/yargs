var optimist = require('../index');
var path = require('path');
var test = require('tap').test;

var $0 = 'node ./' + path.relative(process.cwd(), __filename);

test('count', function(t) {
    var parsed;

    parsed = optimist(['-x']).count('verbose').argv;
    console.error(parsed);
    t.same(parsed.verbose, 0);

    parsed = optimist(['--verbose']).count('verbose').argv;
    t.same(parsed.verbose, 1);

    parsed = optimist(['--verbose', '--verbose']).count('verbose').argv;
    t.same(parsed.verbose, 2);

    // w/alias
    parsed = optimist(['--verbose', '--verbose', '-v', '--verbose']).count('verbose').alias('v', 'verbose').argv;
    t.same(parsed.verbose, 4);

    t.end();
});