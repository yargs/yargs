/* global describe, it, beforeEach */

var expect = require('chai').expect,
  yargs = require('../')

describe('validation tests', function () {
  beforeEach(function () {
    yargs.reset()
  })

  describe('implies', function () {
    it("fails if '_' populated, and implied argument not set", function (done) {
      yargs(['cat'])
        .implies({
          1: 'foo'
        })
        .fail(function (msg) {
          msg.should.match(/Implications failed/)
          return done()
        })
        .argv
    })

    it("fails if key implies values in '_', but '_' is not populated", function (done) {
      yargs(['--foo'])
        .boolean('foo')
        .implies({
          'foo': 1
        })
        .fail(function (msg) {
          msg.should.match(/Implications failed/)
          return done()
        })
        .argv
    })

    it("fails if --no-foo's implied argument is not set", function (done) {
      yargs([])
        .implies({
          '--no-bar': 'foo'
        })
        .fail(function (msg) {
          msg.should.match(/Implications failed/)
          return done()
        })
        .argv
    })

    it('fails if a key is set, along with a key that it implies should not be set', function (done) {
      yargs(['--bar', '--foo'])
        .implies({
          'bar': '--no-foo'
        })
        .fail(function (msg) {
          msg.should.match(/Implications failed/)
          return done()
        })
        .argv
    })
  })

  describe('demand', function () {
    it('fails with standard error message if msg is not defined', function (done) {
      yargs([])
        .demand(1)
        .fail(function (msg) {
          msg.should.equal('Not enough non-option arguments: got 0, need at least 1')
          return done()
        })
        .argv
    })

    it('fails without a message if msg is null', function (done) {
      yargs([])
        .demand(1, null)
        .fail(function (msg) {
          expect(msg).to.equal(null)
          return done()
        })
        .argv
    })
  })
})
