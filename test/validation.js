var should = require('chai').should(),
    expect = require('chai').expect,
    checkValidation = require('./helpers/utils').checkOutput,
    Hash = require('hashish'),
    yargs = require('../');

describe('validation tests', function () {

    beforeEach(function() {
      yargs.reset();
    });

    describe('implies', function() {
        it("fails if '_' populated, and implied argument not set", function(done) {
            var argv = yargs(['cat'])
                .implies({
                    1: 'foo'
                })
                .fail(function(msg) {
                    msg.should.match(/Implications failed/);
                    return done();
                })
                .argv;
        });

        it("fails if key implies values in '_', but '_' is not populated", function(done) {
            var argv = yargs(['--foo'])
                .boolean('foo')
                .implies({
                    'foo': 1
                })
                .fail(function(msg) {
                    msg.should.match(/Implications failed/);
                    return done();
                })
                .argv;
        });

        it("fails if --no-foo's implied argument is not set", function(done) {
            var argv = yargs([])
                .implies({
                    '--no-bar': 'foo'
                })
                .fail(function(msg) {
                    msg.should.match(/Implications failed/);
                    return done();
                })
                .argv;
        });

        it("fails if a key is set, along with a key that it implies should not be set", function(done) {
            var argv = yargs(['--bar', '--foo'])
                .implies({
                    'bar': '--no-foo'
                })
                .fail(function(msg) {
                    msg.should.match(/Implications failed/);
                    return done();
                })
                .argv;
        });
    });

    describe('demand', function() {
        it('fails with standard error message if msg is not defined', function(done) {
            var argv = yargs([])
                .demand(1)
                .fail(function(msg) {
                    msg.should.equal('Not enough non-option arguments: got 0, need at least 1');
                    return done();
                })
                .argv;
        });

        it('fails without a message if msg is null', function(done) {
            var argv = yargs([])
                .demand(1, null)
                .fail(function(msg) {
                    expect(msg).to.equal(null);
                    return done();
                })
                .argv;
        });
    });
});
