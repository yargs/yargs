/* global describe, it, beforeEach */
var yargs = require('../')
var expect = require('chai').expect

require('chai').should()

describe('Command', function () {
  beforeEach(function () {
    yargs.reset()
  })

  describe('positional arguments', function () {
    it('parses command string and populates optional and required positional arguments', function () {
      var y = yargs([])
        .command('foo <bar> [awesome]', 'my awesome command', function (yargs) {
          return yargs
        })
      var command = y.getCommandInstance()
      var handlers = command.getCommandHandlers()
      handlers.foo.demanded.should.include('bar')
      handlers.foo.optional.should.include('awesome')
    })

    it('populates inner argv with positional arguments', function (done) {
      yargs('foo hello world')
        .command('foo <bar> [awesome]', 'my awesome command', function () {}, function (argv) {
          argv._.should.include('foo')
          argv.bar.should.equal('hello')
          argv.awesome.should.equal('world')
          return done()
        })
        .argv
    })

    it('populates outer argv with positional arguments', function () {
      var argv = yargs('foo hello world')
        .command('foo <bar> [awesome]')
        .argv

      argv._.should.include('foo')
      argv.bar.should.equal('hello')
      argv.awesome.should.equal('world')
    })
  })

  describe('missing positional arguments', function () {
    it('fails if a required argument is missing', function (done) {
      var argv = yargs('foo hello')
        .command('foo <bar> <awesome>')
        .fail(function (err) {
          err.should.match(/got 1, need at least 2/)
          return done()
        })
        .argv

      argv.bar.should.equal('hello')
    })

    it('does not fail if optional argument is missing', function () {
      var argv = yargs('foo hello')
        .command('foo <bar> [awesome]')
        .argv

      expect(argv.awesome).to.equal(undefined)
      argv.bar.should.equal('hello')
    })
  })
})
