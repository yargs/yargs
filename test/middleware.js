'use strict'
/* global describe, it, beforeEach, afterEach */

const middlewareFactory = require('../lib/middleware')
let yargs
require('chai').should()

describe('middleware', () => {
  beforeEach(() => {
    yargs = require('../')
  })

  afterEach(() => {
    delete require.cache[require.resolve('../')]
  })
  it('should add a list of callbacks to global middleware', () => {
    const globalMiddleware = []

    middlewareFactory(globalMiddleware)(['callback1', 'callback2'])

    globalMiddleware.should.have.lengthOf(2)
  })

  it('should add a single callback to global middleware', () => {
    const globalMiddleware = []

    middlewareFactory(globalMiddleware)({})

    globalMiddleware.should.have.lengthOf(1)
  })

  it('runs all middleware before reaching the handler', function (done) {
    yargs(['mw'])
      .middleware([
        function (argv) {
          argv.mw1 = 'mw1'
        },
        function (argv) {
          argv.mw2 = 'mw2'
        }
      ])
      .command(
        'mw',
        'adds func list to middleware',
        function () {},
        function (argv) {
          // we should get the argv filled with data from the middleware
          argv.mw1.should.equal('mw1')
          argv.mw2.should.equal('mw2')
          return done()
        }
      )
      .exitProcess(false) // defaults to true.
      .parse()
  })

  it('should be able to register middleware regardless of when middleware is called', function (done) {
    yargs(['mw'])
      .middleware([
        function (argv) {
          argv.mw1 = 'mw1'
        }
      ])
      .command(
        'mw',
        'adds func list to middleware',
        function () {},
        function (argv) {
          // we should get the argv filled with data from the middleware
          argv.mw1.should.equal('mw1')
          argv.mw2.should.equal('mw2')
          return done()
        }
      )
      .middleware([
        function (argv) {
          argv.mw2 = 'mw2'
        }
      ])
      .exitProcess(false) // defaults to true.
      .parse()
  })
})
