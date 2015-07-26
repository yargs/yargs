/* global describe, it, beforeEach */

var expect = require('chai').expect
var yargs = require('../')

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

  describe('choices', function () {
    it('fails with one invalid value', function (done) {
      yargs(['--state', 'denial'])
        .choices('state', ['happy', 'sad', 'hungry'])
        .fail(function (msg) {
          msg.split('\n').should.deep.equal([
            'Invalid values:',
            '  Argument: state, Given: "denial", Choices: "happy", "sad", "hungry"'
          ])
          return done()
        })
        .argv
    })

    it('fails with one valid and one invalid value', function (done) {
      yargs(['--characters', 'susie', '--characters', 'linus'])
        .choices('characters', ['calvin', 'hobbes', 'susie', 'moe'])
        .fail(function (msg) {
          msg.split('\n').should.deep.equal([
            'Invalid values:',
            '  Argument: characters, Given: "linus", Choices: "calvin", "hobbes", "susie", "moe"'
          ])
          return done()
        })
        .argv
    })

    it('fails with multiple invalid values for same argument', function (done) {
      yargs(['--category', 'comedy', '--category', 'drama'])
        .choices('category', ['animal', 'vegetable', 'mineral'])
        .fail(function (msg) {
          msg.split('\n').should.deep.equal([
            'Invalid values:',
            '  Argument: category, Given: "comedy", "drama", Choices: "animal", "vegetable", "mineral"'
          ])
          return done()
        })
        .argv
    })

    it('fails with case-insensitive value', function (done) {
      yargs(['--env', 'DEV'])
        .choices('env', ['dev', 'prd'])
        .fail(function (msg) {
          msg.split('\n').should.deep.equal([
            'Invalid values:',
            '  Argument: env, Given: "DEV", Choices: "dev", "prd"'
          ])
          return done()
        })
        .argv
    })

    it('fails with multiple invalid arguments', function (done) {
      yargs(['--system', 'osx', '--arch', '64'])
        .choices('system', ['linux', 'mac', 'windows'])
        .choices('arch', ['x86', 'x64', 'arm'])
        .fail(function (msg) {
          msg.split('\n').should.deep.equal([
            'Invalid values:',
            '  Argument: system, Given: "osx", Choices: "linux", "mac", "windows"',
            '  Argument: arch, Given: 64, Choices: "x86", "x64", "arm"'
          ])
          return done()
        })
        .argv
    })
  })
})
