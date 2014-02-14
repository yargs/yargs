var optimist = require('../');
var test = require('tap').test;

test('whitespace should be whitespace' , function (t) {
    t.plan(1);
    var x = optimist.parse([ '-x', '\t' ]).x;
    t.equal(x, '\t');
});


var should = require('chai').should(),
    yargs = require('../');

describe('whitespace', function () {

    it('should be whitespace', function () {
        var argv = yargs.parse([ '-x', '\t' ]);
        should.exist(argv);
        argv.should.have.property('x', '\t');
    });

});
